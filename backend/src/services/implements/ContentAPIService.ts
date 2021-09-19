import { ContainerSk } from "../../entities/container/Container";
import { Content } from "../../entities/content/Content";
import { FormatDisplayId } from "../../entities/format/Format";
import { getMaterialType, Property } from "../../entities/format/Property";
import { Structure } from "../../entities/format/Structure";
import { MaterialId } from "../../entities/material/Material";
import { SpaceDisplayId } from "../../entities/space/Space";
import { UserSk } from "../../entities/user/User";
import { encodeMaterialData, MaterialData, toMaterialData } from "../../interfaces/material/Material";
import { ElasticsearchRepository } from "../../repositories/ElasticsearchRepository";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { ContentEditingRepository } from "../../repositories/implements/content/ContentEditingRepository";
import { ContentRepository } from "../../repositories/implements/content/ContentRepository.";
import { FormatRepository } from "../../repositories/implements/format/FormatRepository";
import { MaterialEditingRepository } from "../../repositories/implements/material/MaterialEditingRepository";
import { MaterialRepository } from "../../repositories/implements/material/MaterialRepository";
import { ActivityRepository } from "../../repositories/implements/reactions/ActivityRepository";
import { CommentRepository } from "../../repositories/implements/reactions/CommentRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../../repositories/implements/space/SpaceRepository";
import { UserRepository } from "../../repositories/implements/user/UserRepository";
import { Transaction } from "../../repositories/Transaction";
import { splitArray } from "../../Utils";
import { BaseService } from "../BaseService";
import { PasswordSecurity } from "../Security";
import { ServiceContext } from "../ServiceContext";

function getProperty(data: any, prop: Property) {
    if (data[prop.id]) {
        return data[prop.id];
    } else if (prop.fieldName && data[prop.fieldName]) {
        return data[prop.fieldName];
    } else if (data[prop.displayName]) {
        return data[prop.displayName];
    } else {
        return null;
    }
}

function normalizeData(data: any, struct: Structure): { contentData: any, materials: { property: Property, data: MaterialData }[] } {
    const contentData = {};
    const materials: { property: Property, data: MaterialData }[] = [];
    for (const prop of struct.properties) {
        const value = getProperty(data, prop);
        if (!prop.optional && value == null) {
            throw new Error(`${prop.displayName}(${prop.entityId})が指定されていません`);
        }

        const materialType = getMaterialType(prop.typeName);
        if (materialType) {
            if (value) {
                materials.push({ property: prop, data: toMaterialData(materialType, value) });
            }
        } else {
            contentData[prop.entityId] = value;
        }
    }
    return { contentData, materials };
}

export class ContentAPIService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private con: ContentRepository,
        private edit: ContentEditingRepository,
        private mat: MaterialRepository,
        private matEdit: MaterialEditingRepository,
        private spaces: SpaceRepository,
        private containers: ContainerRepository,
        private formats: FormatRepository,
        private auth: AuthorityRepository,
        private act: ActivityRepository,
        private com: CommentRepository,
        private index: ElasticsearchRepository,
        private users: UserRepository) {
        super(ctx);
    }

    private async _upsertContent(trx: Transaction, userId: UserSk, containerId: ContainerSk, data: any, structure: Structure) {
        let oldContent: Content | null = null;
        let semanticId: string | null = null;
        if (structure.format.semanticId) {
            const justSemanticId = getProperty(data, structure.format.semanticId);
            oldContent = await this.con.fromContents(trx).bySemanticId(containerId, justSemanticId).joinCommitAndData().getOne() || null;
            semanticId = justSemanticId;
        }

        const normalized = normalizeData(data, structure);
        data = normalized.contentData;

        let content: Content;
        if (!oldContent) {
            const result = await this.con.createCommand(trx).createContent(containerId, structure.id, userId, {}, semanticId);

            const promises = normalized.materials.map(async item => {
                if (item.data.text != "" && item.data.document?.blocks.length != 0) {
                    const material = await this.mat.createCommand(trx).createMaterialInContent(result.content.id, userId, item.data, null);
                    data[item.property.entityId] = material.entityId;
                } else {
                    data[item.property.entityId] = null;
                }
            });
            await Promise.all(promises);
            await this.con.createCommand(trx).updateCommit(result.commit.id, data);

            content = result.content;
        } else {
            const oldContent2 = oldContent;
            const promises = normalized.materials.map(async item => {
                const oldMaterialId: MaterialId = oldContent2.commit.data[item.property.entityId];
                let materialId: MaterialId | null;
                if (oldMaterialId) {
                    const oldMaterial = await this.mat.fromMaterials(trx).byEntityId(oldMaterialId).joinCommitAndSelectData().getNeededOne();
                    if (oldMaterial.commit.data != encodeMaterialData(item.data).data) {
                        await this.mat.createCommand(trx).commitMaterial(userId, oldMaterial.id, item.data, null);
                    }
                    materialId = oldMaterial.entityId;
                } else if (item.data && item.data.text != "" && item.data.document?.blocks.length != 0) {
                    const material = await this.mat.createCommand(trx).createMaterialInContent(oldContent2.id, userId, item.data, null);
                    materialId = material.entityId;
                } else {
                    materialId = null;
                }
                data[item.property.entityId] = materialId;
                content = oldContent2;
            });
            await Promise.all(promises);

            await this.con.createCommand(trx).commitContent(userId, oldContent.id, structure.id, data);
            content = oldContent;
        }

        return content;
    }

    async upsertContents(args: {
        email: string,
        password: string,
        space: SpaceDisplayId,
        format: FormatDisplayId,
        formatVersion?: number | null,
        data: any[]
    }): Promise<{}> {
        const user = await this.users.fromUsers().byEmail(args.email).getNeededOne();
        if (user.certificationToken) {
            throw new Error("メールアドレスの確認が完了していません");
        }
        if (!PasswordSecurity.compare(args.password, user.passwordHash)) {
            throw new Error("Wrong password");
        }
        if (args.data.length > 10000) {
            throw new Error("1万件以上のデータは一度に扱えません");
        }

        return await this.ctx.transaction(async trx => {
            const format = await this.formats.fromFormats(trx).byDisplayId(args.format).getNeededOne();
            const [_, structure] = args.formatVersion
                ? await this.formats.fromStructures(trx).byFormatAndVersion(format.id, args.formatVersion).selectFocusedFormat().getNeededOneWithRaw()
                : await this.formats.fromStructures(trx).byId(format.currentStructureId).selectFocusedFormat().getNeededOneWithRaw();
            const space = await this.spaces.fromSpaces(trx).byDisplayId(args.space).getNeededOne();
            const container = await this.containers.createCommand(trx).getOrCreate(space.id, format.id);

            const dataSets = splitArray(args.data, 30);
            let i=0;
            for (const dataSet of dataSets) {
                console.log(i);

                const promises = dataSet.map(x => this._upsertContent(trx, user.id, container.id, x, structure));
                await Promise.all(promises);
                i++;
            }

            return {};
        });
    }
}