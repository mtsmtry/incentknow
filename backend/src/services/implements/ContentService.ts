import { ObjectLiteral } from "typeorm";
import { ContentId, ContentSk } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentDraft, ContentDraftId, ContentDraftState } from "../../entities/content/ContentDraft";
import { FormatDisplayId, FormatId } from "../../entities/format/Format";
import { PropertyId, TypeName } from "../../entities/format/Property";
import { Structure, StructureId } from "../../entities/format/Structure";
import { MaterialId, MaterialType } from "../../entities/material/Material";
import { MaterialDraftId } from "../../entities/material/MaterialDraft";
import { MaterialEditingState } from "../../entities/material/MaterialEditing";
import { SpaceAuth, SpaceDisplayId, SpaceId } from "../../entities/space/Space";
import { UserSk } from "../../entities/user/User";
import { Data, DataKind, DataMember } from "../../Implication";
import { FocusedContent, RelatedContent } from "../../interfaces/content/Content";
import { FocusedContentCommit, RelatedContentCommit } from "../../interfaces/content/ContentCommit";
import { FocusedContentDraft, RelatedContentDraft } from "../../interfaces/content/ContentDraft";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { ContentEditingRepository } from "../../repositories/implements/content/ContentEditingRepository";
import { ContentRepository } from "../../repositories/implements/content/ContentRepository.";
import { FormatRepository } from "../../repositories/implements/format/FormatRepository";
import { MaterialEditingRepository } from "../../repositories/implements/material/MaterialEditingRepository";
import { MaterialRepository } from "../../repositories/implements/material/MaterialRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../../repositories/implements/space/SpaceRepository";
import { Transaction } from "../../repositories/Transaction";
import { BaseService } from "../BaseService";
import { InternalError, LackOfAuthority, NotFoundEntity, WrongTargetState } from "../Errors";
import { ServiceContext } from "../ServiceContext";

export enum MaterialCompositionType {
    CREATION = "creation",
    MOVE = "move"
}

@Data()
export class MaterialComposition {
    @DataKind()
    type: MaterialCompositionType;

    @DataMember([MaterialCompositionType.CREATION, MaterialCompositionType.CREATION])
    propertyId: string;

    @DataMember([MaterialCompositionType.MOVE])
    materialId: MaterialId;

    @DataMember([MaterialCompositionType.CREATION])
    data: string;
}

export class ContentService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private con: ContentRepository,
        private edit: ContentEditingRepository,
        private mat: MaterialRepository,
        private matEdit: MaterialEditingRepository,
        private spaces: SpaceRepository,
        private containers: ContainerRepository,
        private formats: FormatRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    private async _transferMaterialDrafts(trx: Transaction, userId: UserSk, contentDraft: ContentDraft, data: any | null, struct: Structure) {
        if (!data) {
            return;
        }
        for (const prop of struct.properties) {
            const matId = data[prop.entityId] as MaterialDraftId | null;
            if (prop.typeName == TypeName.DOCUMENT && matId) {
                const matDraft = await this.matEdit.fromDrafts(trx).byEntityId(matId).getNeededOne();
                if (matDraft.userId != userId) {
                    throw new LackOfAuthority();
                }

                if (matDraft.materialId) {
                    const mat = await this.mat.fromMaterials(trx).byId(matDraft.materialId).getNeededOne();
                    if (mat.contentId != contentDraft.contentId) {
                        throw "所属コンテンツが異なります";
                    }
                }
                else if (matDraft.intendedContentDraftId != contentDraft.id) {
                    await this.matEdit.createCommand(trx).trasferToContentDraft(matDraft.id, contentDraft.id);
                }
            }
        }
    }

    private async _commitMaterials(trx: Transaction, userId: UserSk, contentId: ContentSk, contentDraft: ContentDraft, data: any | null, struct: Structure) {
        if (!data) {
            return;
        }
        for (const prop of struct.properties) {
            const matId = data[prop.entityId] as MaterialDraftId | null;

            if (prop.typeName == TypeName.DOCUMENT && matId) {

                const matDraft = await this.matEdit.fromDrafts(trx).byEntityId(matId).joinSnapshotAndSelectData().getNeededOne();
                if (matDraft.userId != userId) {
                    throw new LackOfAuthority();
                }

                const currentEditing = matDraft.currentEditing;
                if (currentEditing) {
                    const editing = await this.matEdit.fromEditings(trx).byId(currentEditing.id).getNeededOne();

                    if (matDraft.materialId) {
                        const mat = await this.mat.fromMaterials(trx).byId(matDraft.materialId).getNeededOne();
                        if (mat.contentId != contentDraft.contentId) {
                            throw "所属コンテンツが異なります";
                        }
                        await Promise.all([
                            this.matEdit.createCommand(trx).closeEditing(matDraft, MaterialEditingState.COMMITTED),
                            this.mat.createCommand(trx).commitMaterial(userId, matDraft.materialId, currentEditing.snapshot.data, editing.id)
                        ]);
                        data[prop.entityId] = mat.entityId;
                    }
                    else {
                        const material = await this.mat.createCommand(trx).createMaterialInContent(contentId, userId, currentEditing.snapshot.data, MaterialType.DOCUMENT, currentEditing.id);
                        await Promise.all([
                            this.matEdit.createCommand(trx).makeDraftContent(matDraft.id, material.raw.id),
                            this.matEdit.createCommand(trx).closeEditing(matDraft, MaterialEditingState.COMMITTED),
                        ]);
                        data[prop.entityId] = material.raw.entityId;
                    }
                } else if (matDraft.materialId) {
                    const mat = await this.mat.fromMaterials(trx).byId(matDraft.materialId).getNeededOne();
                    if (mat.contentId != contentDraft.contentId) {
                        throw "所属コンテンツが異なります";
                    }
                    data[prop.entityId] = mat.entityId;
                } else {
                    throw new InternalError();
                }
            }
        }
        return data;
    }

    private _normalizeData(data: any, struct: Structure, isDraft: boolean) {
        if (!data) {
            return null;
        }
        for (const prop of struct.properties) {
            const value = data[prop.entityId];
            if (prop.typeName == TypeName.DOCUMENT) {
                if (isDraft) {
                    if (value?.draftId) {
                        data[prop.entityId] = value.draftId;
                    } else {
                        data[prop.entityId] = null;
                    }
                } else {
                    if (value?.materialId) {
                        data[prop.entityId] = value.materialId;
                    } else {
                        data[prop.entityId] = null;
                    }
                }
            } else if (prop.typeName == TypeName.CONTENT) {
                data[prop.entityId] = value?.contentId || null;
            }
        }
        return data;
    }

    private async _fromMaterialToMaterialDraft(trx: Transaction, userId: UserSk, data: any | null, struct: Structure) {
        if (!data) {
            return null;
        }
        for (const prop of struct.properties) {
            const matId = data[prop.entityId] as MaterialId | null;
            if (prop.typeName == TypeName.DOCUMENT && matId) {
                const mat = await this.mat.fromMaterials(trx).byEntityId(matId).joinCommitAndSelectData().getNeededOne();
                const matDraft = await this.matEdit.createCommand(trx).getOrCreateActiveDraft(userId, mat.id, mat.commit.data, null);
                data[prop.entityId] = matDraft.raw.entityId;
            }
        }
        return data;
    }

    async startContentEditing(contentId: ContentId, basedCommitId: ContentCommitId | null): Promise<ContentDraftId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const content = await this.con.fromContents(trx).byEntityId(contentId).joinCommitAndData().getNeededOne();
            const basedCommit = basedCommitId ? await this.con.fromCommits(trx).byEntityId(basedCommitId).getNeededOne() : null;
            const struct = await this.formats.fromStructures(trx).byId(content.structureId).selectPropertiesJoined().getNeededOne();
            const data = await this._fromMaterialToMaterialDraft(trx, userId, content.commit.data, struct);
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, content.id, content.commit.data);
            /*
            for (const prop of struct.properties) {
                const matDraftId = data[prop.entityId] as MaterialDraftId | null;
                if (prop.typeName == TypeName.DOCUMENT && matDraftId) {
                    const matDraftSk = await this.matEdit.fromDrafts(trx).byEntityId(matDraftId).selectId().getNeededOne();
                    const commit = await this.matCom.fromCommits(trx).latest().selectAll().getNeededOne();
                    await this.matEdit.createCommand(trx).activateDraft(matDraftSk, commit);
                }
            }
            */
            return draft.raw.entityId;
        });
    }

    async createNewContentDraft(structureId: StructureId, spaceId: SpaceId | null, data: ObjectLiteral): Promise<ContentDraftId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const spaceSk = spaceId ? await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne() : null;
            const structure = await this.formats.fromStructures(trx).byEntityId(structureId).selectPropertiesJoined().getNeededOne();
            data = this._normalizeData(data, structure, true);
            const draft = await this.edit.createCommand(trx).createActiveBlankDraft(userId, structure.id, spaceSk, data);
            await this._transferMaterialDrafts(trx, userId, draft.raw, data, structure);
            return draft.raw.entityId;
        });
    }

    async editContentDraft(contentDraftId: ContentDraftId, data: any): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(contentDraftId).selectRaw().getNeededOne();
            if (draft.state != ContentDraftState.EDITING) {
                throw new WrongTargetState("The state of this material draft is not editing");
            }
            const structure = await this.formats.fromStructures(trx).byId(draft.structureId).selectPropertiesJoined().getNeededOne();

            data = this._normalizeData(data, structure, true);

            await this.edit.createCommand(trx).updateDraft(draft, data);
            await this._transferMaterialDrafts(trx, userId, draft, data, structure);
            return {};
        });
    }

    async commitContent(contentDraftId: ContentDraftId, data: any): Promise<ContentId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts(trx).byEntityId(contentDraftId).selectRaw().getNeededOne();
            if (draft.state != ContentDraftState.EDITING) {
                throw new WrongTargetState();
            }

            const [format, structure] = await this.formats.fromStructures(trx).byId(draft.structureId).selectFocusedFormat().getNeededOneWithRaw();
            data = this._normalizeData(data, structure, true);

            if (draft.contentId) {
                const [auth, material] = await this.auth.fromAuths(trx).getContentAuth(SpaceAuth.WRITABLE, userId, draft.contentId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                data = await this._commitMaterials(trx, userId, draft.contentId, draft, data, structure);
                const [_2, commit] = await Promise.all([
                    this.edit.createCommand(trx).commitEditing(draft),
                    this.con.createCommand(trx).commitContent(userId, draft.contentId, draft.structureId, data)
                ]);

                const content = await this.con.fromContents(trx).byId(draft.contentId).getNeededOne();
                return content.entityId;
            } else if (draft.intendedSpaceId) {
                const [auth, _] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, draft.intendedSpaceId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const container = await this.containers.createCommand(trx).getOrCreate(draft.intendedSpaceId, structure.formatId);

                const { content, commit } = await this.con.createCommand(trx).createContent(container.id, draft.structureId, userId, {});
                data = await this._commitMaterials(trx, userId, content.id, draft, data, structure);

                const [_2, _3] = await Promise.all([
                    this.edit.createCommand(trx).makeDraftContent(draft.id, content.id),
                    this.edit.createCommand(trx).commitEditing(draft),
                    this.con.createCommand(trx).updateCommit(commit.id, data)
                ]);

                return content.entityId;
            } else {
                throw new InternalError();
            }
        });
    }

    async getContent(contentId: ContentId): Promise<FocusedContent> {
        const userId = this.ctx.getAuthorized();
        const contents = await this.con.fromContents().byEntityId(contentId).getFocusedMany(userId, this.con, this.formats, this.edit);
        if (contents.length == 0) {
            throw new NotFoundEntity();
        }
        return contents[0];
    }

    async getRelatedContent(contentId: ContentId): Promise<RelatedContent> {
        const userId = this.ctx.getAuthorized();
        const contents = await this.con.fromContents().byEntityId(contentId).getRelatedMany(this.con, this.formats);
        if (contents.length == 0) {
            throw new NotFoundEntity();
        }
        return contents[0];
    }

    async getContents(spaceId: SpaceId, formatId: FormatId): Promise<RelatedContent[]> {
        const userId = this.ctx.getAuthorized();
        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byEntityId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byEntityId(formatId).selectId().getNeededOne()
        ]);
        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
        return await this.con.fromContents().byContainer(containerSk).getRelatedMany(this.con, this.formats);
    }

    async getContentsByProperty(spaceId: SpaceId, formatId: FormatId, propertyId: PropertyId, value: string): Promise<RelatedContent[]> {
        const userId = this.ctx.getAuthorized();
        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byEntityId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byEntityId(formatId).selectId().getNeededOne()
        ]);
        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
        return await this.con.fromContents().byProperty(containerSk, propertyId, value).getRelatedMany(this.con, this.formats);
    }

    async getContentsByDisplayId(spaceId: SpaceDisplayId, formatId: FormatDisplayId): Promise<RelatedContent[]> {
        const userId = this.ctx.getAuthorized();
        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byDisplayId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byDisplayId(formatId).selectId().getNeededOne()
        ]);
        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
        return await this.con.fromContents().byContainer(containerSk).getRelatedMany(this.con, this.formats);
    }

    async getMyContentDrafts(): Promise<RelatedContentDraft[]> {
        const userId = this.ctx.getAuthorized();
        const drafts = await this.edit.fromDrafts().byUser(userId).getRelatedMany(this.con, this.formats, this.matEdit);
        return drafts;
    }

    async getContentDraft(draftId: ContentDraftId): Promise<FocusedContentDraft> {
        // const userId = this.ctx.getAuthorized();
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const drafts = await this.edit.fromDrafts().byEntityId(draftId).getFocusedMany(this.con, this.formats, this.matEdit);
            if (drafts.length == 0) {
                throw new NotFoundEntity("Draft is not found");
            }
            const draft = drafts[0];

            //const draft = await this._getFocusedContentDraftWhole(query);
            if (!draft) {
                throw new NotFoundEntity();
            }
            return draft;
        });
    }

    async getContentCommits(contentId: ContentId): Promise<RelatedContentCommit[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, content] = await this.auth.fromAuths().getContentAuth(SpaceAuth.READABLE, userId, contentId);
        return await this.con.fromCommits().byContent(content.id).selectRelated().getMany();
    }

    async getContentCommit(commitId: ContentCommitId): Promise<FocusedContentCommit> {
        return await this.con.fromCommits().byEntityId(commitId).selectFocused().getNeededOne();
    }

    async getSpaceLatestContents(spaceId: SpaceId): Promise<RelatedContent[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.READABLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.con.fromContents().bySpace(space.id).latest().limit(10).getRelatedMany(this.con, this.formats);
    }
}