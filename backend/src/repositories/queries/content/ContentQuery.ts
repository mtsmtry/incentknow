import { SelectQueryBuilder } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { PropertyId, TypeName } from "../../../entities/format/Property";
import { StructureSk } from "../../../entities/format/Structure";
import { Material } from "../../../entities/material/Material";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { toFocusedContent, toRelatedContent } from "../../../interfaces/content/Content";
import { RelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedFormat } from "../../../interfaces/format/Format";
import { toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/Material";
import { mapBy, mapByString } from "../../../Utils";
import { ContentEditingRepository } from "../../implements/content/ContentEditingRepository";
import { ContentRepository } from "../../implements/content/ContentRepository.";
import { FormatRepository } from "../../implements/format/FormatRepository";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class ContentQuery extends SelectFromSingleTableQuery<Content, ContentQuery, ContentSk, ContentId, null> {
    constructor(qb: SelectQueryBuilder<Content>) {
        super(qb, ContentQuery);
    }

    byContainer(containerId: ContainerSk) {
        return new ContentQuery(this.qb.where({ containerId }));
    }

    bySpace(spaceId: SpaceSk) {
        const query = this.qb
            .innerJoin("x.container", "container")
            .where("container.spaceId = :spaceId", { spaceId });
        return new ContentQuery(query);
    }

    byProperty(containerId: ContainerSk, propertyId: PropertyId, value: any) {
        const query = this.qb.where({ containerId }).andWhere(`commit.data->>"$.${propertyId}" = :value`, { value });
        return new ContentQuery(query);
    }

    joinStructureAndFormat() {
        return new ContentQuery(this.qb.leftJoinAndSelect("x.structure", "structure").leftJoinAndSelect("structure.format", "format"));
    }

    latest() {
        return new ContentQuery(this.qb.orderBy("x.updatedAt", "DESC"));
    }

    limit(count: number) {
        return new ContentQuery(this.qb.limit(count));
    }

    static async locateContents(rep: ContentRepository, data: any, format: FocusedFormat) {
        const promises = format.currentStructure.properties.map(async prop => {
            const value = data[prop.id];
            if (value == null) {
                return;
            }
            if (prop.type.name == TypeName.CONTENT && prop.type.format) {
                const [buildContent, raw] = await rep.fromContents().byEntityId(value).selectRelated().getOneWithRaw();
                data[prop.id] = buildContent ? buildContent(prop.type.format) : "deleted";
            }
        });
        await Promise.all(promises);
    }

    static async locateMaterials(data: any, materials: Material[], format: FocusedFormat, isFocused: boolean) {
        const materialDict = mapByString(materials, x => x.entityId);
        const promises = format.currentStructure.properties.map(async prop => {
            const value = data[prop.id];
            if (!value) {
                return;
            }
            if (prop.type.name == TypeName.DOCUMENT || prop.type.name == TypeName.TEXT) {
                const material = materialDict[value];
                if (!material) {
                    data[prop.id] = "deleted";
                } else {
                    data[prop.id] = isFocused ? toFocusedMaterial(material, null) : toRelatedMaterial(material);
                }
            }
        });
        await Promise.all(promises);
    }

    private selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .leftJoinAndSelect("x.materials", "materials")
            .leftJoinAndSelect("materials.commit", "materialCommits")
            .leftJoinAndSelect("materials.creatorUser", "materialCreatorUsers")
            .leftJoinAndSelect("materials.updaterUser", "materialUpdaterUsers")
            .leftJoinAndSelect("x.commit", "commit")
            .addSelect("commit.data");

        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContent(x, f));
    }

    private selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .leftJoinAndSelect("x.materials", "materials")
            .leftJoinAndSelect("materials.commit", "materialCommits")
            .leftJoinAndSelect("materials.creatorUser", "materialCreatorUsers")
            .leftJoinAndSelect("materials.updaterUser", "materialUpdaterUsers")
            .leftJoinAndSelect("x.commit", "commit")
            .addSelect("materialCommits.data")
            .addSelect("commit.data");

        return mapQuery(query, x => (f: FocusedFormat, d: RelatedContentDraft | null) => {
            x.materials.forEach(mat => mat.content = x);
            return toFocusedContent(x, d, f);
        });
    }

    async getRelatedMany(rep: ContentRepository, formatRep: FormatRepository) {
        const contents = await this.selectRelated().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(contents.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [format, struct] = await getFormat(x);
            //const relations = await formatRep.getRelations(struct.formatId);
            //const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const focusedContents = await Promise.all(contents.map(async content => {
            const format = structMap[content.raw.structureId].format;
            await Promise.all([
                ContentQuery.locateContents(rep, content.raw.commit.data, format),
                ContentQuery.locateMaterials(content.raw.commit.data, content.raw.materials, format, false)
            ]);
            return content.result(format);
        }));

        return focusedContents;
    }

    async getFocusedMany(userId: UserSk | null, rep: ContentRepository, formatRep: FormatRepository, editRep: ContentEditingRepository) {
        const contents = await this.selectFocused().getManyWithRaw();

        // Structures
        const structIds = Array.from(new Set(contents.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => formatRep.fromStructures().byId(structId).selectFocusedFormat().getNeededOneWithRaw();
        const structs = await Promise.all(structIds.map(async x => {
            const [format, struct] = await getFormat(x);
            //const relations = await formatRep.getRelations(struct.formatId);
            //const format = buildFormat(relations);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);

        // Build
        const focusedContents = await Promise.all(contents.map(async content => {
            const format = structMap[content.raw.structureId].format;
            let draft: RelatedContentDraft | null = null;
            if (userId) {
                const buildDraft = await editRep.fromDrafts().byUser(userId).byContent(content.raw.id).selectRelated().getOne();
                draft = buildDraft ? buildDraft(format) : null;
            }

            await Promise.all([
                ContentQuery.locateContents(rep, content.raw.commit.data, format),
                ContentQuery.locateMaterials(content.raw.commit.data, content.raw.materials, format, true)
            ]);
            return content.result(format, draft);
        }));

        return focusedContents;
    }

    joinCommitAndData() {
        return new ContentQuery(this.qb.leftJoinAndSelect("x.commit", "commit").addSelect("commit.data"));
    }
}

export class ContentQueryFromEntity extends SelectQueryFromEntity<Content> {
    constructor(content: Content) {
        super(content);
    }
}