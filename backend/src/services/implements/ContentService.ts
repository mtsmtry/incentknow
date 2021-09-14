import { ObjectLiteral } from "typeorm";
import { ContentId, ContentSk } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentDraft, ContentDraftId, ContentDraftState } from "../../entities/content/ContentDraft";
import { FormatDisplayId, FormatId, FormatSk } from "../../entities/format/Format";
import { isMaterialType, TypeName } from "../../entities/format/Property";
import { Structure, StructureId } from "../../entities/format/Structure";
import { MaterialId } from "../../entities/material/Material";
import { MaterialDraftId } from "../../entities/material/MaterialDraft";
import { MaterialEditingState } from "../../entities/material/MaterialEditing";
import { SpaceAuthority, SpaceDisplayId, SpaceId, SpaceSk } from "../../entities/space/Space";
import { UserSk } from "../../entities/user/User";
import { Data, DataKind, DataMember } from "../../Implication";
import { Authority, FocusedContent, IntactContentPage, RelatedContent, SearchedContent } from "../../interfaces/content/Content";
import { FocusedContentCommit, RelatedContentCommit } from "../../interfaces/content/ContentCommit";
import { FocusedContentDraft, RelatedContentDraft } from "../../interfaces/content/ContentDraft";
import { MaterialData, toMaterialData } from "../../interfaces/material/Material";
import { MaterialDraftUpdation } from "../../interfaces/material/MaterialDraft";
import { ElasticsearchRepository, HitContent } from "../../repositories/ElasticsearchRepository";
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
import { checkAuthority, checkSpaceAuthority, getAuthority } from "../../repositories/queries/space/AuthorityQuery";
import { Transaction } from "../../repositories/Transaction";
import { mapByString, notNull } from "../../Utils";
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
        private auth: AuthorityRepository,
        private act: ActivityRepository,
        private com: CommentRepository,
        private index: ElasticsearchRepository) {
        super(ctx);
    }

    private async _transferMaterialDrafts(trx: Transaction, userId: UserSk, contentDraft: ContentDraft, data: any | null, struct: Structure) {
        if (!data) {
            return;
        }
        for (const prop of struct.properties) {
            const matId = data[prop.entityId] as MaterialDraftId | null;
            if (isMaterialType(prop.typeName) && matId) {
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

    private async _commitMaterials(
        trx: Transaction,
        userId: UserSk,
        contentId: ContentSk,
        contentDraft: ContentDraft,
        data: ObjectLiteral | null,
        struct: Structure,
        materialUpdations: MaterialDraftUpdation[]
    ): Promise<{ data: ObjectLiteral | null, materials: { [propertyId: string]: MaterialData } }> {
        if (!data) {
            return { data: null, materials: {} };
        }
        const materials: { [propertyId: string]: MaterialData } = {};
        const materialUpdationMap = mapByString(materialUpdations, x => x.draftId);
        for (const prop of struct.properties) {
            const matId = data[prop.entityId] as MaterialDraftId | null;

            if (isMaterialType(prop.typeName) && matId) {
                const matDraft = await this.matEdit.fromDrafts(trx).byEntityId(matId).joinSnapshotAndSelectData().getNeededOne();

                if (matDraft.userId != userId) {
                    throw new LackOfAuthority();
                }

                const currentEditing = matDraft.currentEditing;
                if (currentEditing) {
                    const editing = await this.matEdit.fromEditings(trx).byId(currentEditing.id).getNeededOne();

                    let materialData = toMaterialData(matDraft.intendedMaterialType, currentEditing.snapshot.data);
                    // materialUpdationsがある場合は、それを使う
                    if (materialUpdationMap[matId]) {
                        materialData = materialUpdationMap[matId].data;
                    }
                    materials[prop.entityId] = materialData;

                    if (matDraft.materialId) {
                        const mat = await this.mat.fromMaterials(trx).byId(matDraft.materialId).getNeededOne();
                        if (mat.contentId != contentDraft.contentId) {
                            throw "所属コンテンツが異なります";
                        }
                        await Promise.all([
                            this.matEdit.createCommand(trx).closeEditing(matDraft, MaterialEditingState.COMMITTED),
                            this.mat.createCommand(trx).commitMaterial(userId, matDraft.materialId, materialData, editing.id)
                        ]);
                        data[prop.entityId] = mat.entityId;
                    }
                    else {
                        const material = await this.mat.createCommand(trx).createMaterialInContent(contentId, userId, materialData, currentEditing.id);
                        await Promise.all([
                            this.matEdit.createCommand(trx).makeDraftContent(matDraft.id, material.raw.id),
                            this.matEdit.createCommand(trx).closeEditing(matDraft, MaterialEditingState.COMMITTED),
                        ]);
                        data[prop.entityId] = material.raw.entityId;
                    }
                } else if (matDraft.materialId) {
                    const mat = await this.mat.fromMaterials(trx).byId(matDraft.materialId).joinCommitAndSelectData().getNeededOne();
                    if (mat.contentId != contentDraft.contentId) {
                        throw "所属コンテンツが異なります";
                    }
                    materials[prop.entityId] = toMaterialData(mat.materialType, mat.commit.data);
                    data[prop.entityId] = mat.entityId;
                } else {
                    throw new InternalError();
                }
            }
        }
        return { data, materials };
    }

    private _normalizeData(data: any, struct: Structure, isDraft: boolean) {
        if (!data) {
            return null;
        }
        for (const prop of struct.properties) {
            const value = data[prop.entityId];
            if (isMaterialType(prop.typeName)) {
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
            if (isMaterialType(prop.typeName) && matId) {
                const mat = await this.mat.fromMaterials(trx).byEntityId(matId).joinCommitAndSelectData().getNeededOne();
                const matDraft = await this.matEdit.createCommand(trx).getOrCreateActiveDraft(userId, mat.id, toMaterialData(mat.materialType, mat.commit.data), null);
                data[prop.entityId] = matDraft.raw.entityId;
            }
        }
        return data;
    }

    async startContentEditing(contentId: ContentId, basedCommitId: ContentCommitId | null): Promise<ContentDraftId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth] = await this.auth.fromAuths(trx).getContentAuthority(userId, contentId);
            checkAuthority(auth, Authority.WRITABLE);
            const content = await this.con.fromContents(trx).byEntityId(contentId).joinCommitAndData().getNeededOne();
            const basedCommit = basedCommitId ? await this.con.fromCommits(trx).byEntityId(basedCommitId).getNeededOne() : content.commitId;
            const struct = await this.formats.fromStructures(trx).byId(content.structureId).selectPropertiesJoined().getNeededOne();
            const data = await this._fromMaterialToMaterialDraft(trx, userId, content.commit.data, struct);
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, content.id, data, content.structureId);
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
            if (spaceId) {
                const [auth] = await this.auth.fromAuths(trx).getSpaceAuthority(userId, spaceId);
                checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);
            }
            const spaceSk = spaceId ? await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne() : null;
            const structure = await this.formats.fromStructures(trx).byEntityId(structureId).selectPropertiesJoined().getNeededOne();
            data = this._normalizeData(data, structure, true);
            const draft = await this.edit.createCommand(trx).createActiveBlankDraft(userId, structure.id, spaceSk, data);
            await this._transferMaterialDrafts(trx, userId, draft.raw, data, structure);
            return draft.raw.entityId;
        });
    }

    async editContentDraft(contentDraftId: ContentDraftId, data: any, materialUpdations: MaterialDraftUpdation[]): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(contentDraftId).selectRaw().getNeededOne();
            if (draft.state != ContentDraftState.EDITING) {
                throw new WrongTargetState("The state of this material draft is not editing");
            }
            if (draft.userId != userId) {
                throw new LackOfAuthority();
            }
            const structure = await this.formats.fromStructures(trx).byId(draft.structureId).selectPropertiesJoined().getNeededOne();

            data = this._normalizeData(data, structure, true);

            await this.edit.createCommand(trx).updateDraft(draft, data);

            // materialUpdationを適用
            const promises = materialUpdations.map(async materialUpdation => {
                const draft = await this.matEdit.fromDrafts().byEntityId(materialUpdation.draftId).joinSnapshotAndSelectData().getNeededOne();
                await this.matEdit.createCommand(trx).updateDraft(draft, materialUpdation.data);
            })
            await Promise.all(promises);

            await this._transferMaterialDrafts(trx, userId, draft, data, structure);
            return {};
        });
    }

    async commitContent(contentDraftId: ContentDraftId, data: any, materialUpdations: MaterialDraftUpdation[]): Promise<ContentId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts(trx).byEntityId(contentDraftId).selectRaw().getNeededOne();
            if (draft.state != ContentDraftState.EDITING) {
                throw new WrongTargetState();
            }

            const [format, structure] = await this.formats.fromStructures(trx).byId(draft.structureId).selectFocusedFormat().getNeededOneWithRaw();
            data = this._normalizeData(data, structure, true);

            if (draft.contentId) {
                const [auth] = await this.auth.fromAuths(trx).getContentAuthority(userId, draft.contentId);
                checkAuthority(auth, Authority.WRITABLE);

                const commitMaterialsResult = await this._commitMaterials(trx, userId, draft.contentId, draft, data, structure, materialUpdations);
                data = commitMaterialsResult.data;
                const [_2, commit] = await Promise.all([
                    this.edit.createCommand(trx).commitEditing(draft),
                    this.con.createCommand(trx).commitContent(userId, draft.contentId, draft.structureId, data)
                ]);

                const content = await this.con.fromContents(trx).byId(draft.contentId).getNeededOne();

                // Activity
                const container = await this.containers.fromContainers(trx).byId(content.containerId).getNeededOne();
                await this.act.createCommand(trx).createOnContentUpdated(userId, container.spaceId, content.id);

                // Index
                this.index.indexContent({
                    containerId: container.entityId,
                    formatId: structure.format.entityId,
                    contentId: content.entityId
                },
                    true, structure, data, commitMaterialsResult.materials
                );

                return content.entityId;
            } else if (draft.intendedSpaceId) {
                const [auth] = await this.auth.fromAuths(trx).getSpaceAuthority(userId, draft.intendedSpaceId);
                checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

                const container = await this.containers.createCommand(trx).getOrCreate(draft.intendedSpaceId, structure.formatId);

                const { content, commit } = await this.con.createCommand(trx).createContent(container.id, draft.structureId, userId, {});
                const commitMaterialsResult = await this._commitMaterials(trx, userId, content.id, draft, data, structure, materialUpdations);
                data = commitMaterialsResult.data;

                const [_2, _3] = await Promise.all([
                    this.edit.createCommand(trx).makeDraftContent(draft.id, content.id),
                    this.edit.createCommand(trx).commitEditing(draft),
                    this.con.createCommand(trx).updateCommit(commit.id, data)
                ]);

                // Activity
                await this.act.createCommand(trx).createOnContentCreated(userId, draft.intendedSpaceId, content.id);

                // Index
                this.index.indexContent({
                    containerId: container.entityId,
                    formatId: structure.format.entityId,
                    contentId: content.entityId
                },
                    true, structure, data, commitMaterialsResult.materials
                );

                return content.entityId;
            } else {
                throw new InternalError();
            }
        });
    }

    async getContent(contentId: ContentId): Promise<FocusedContent> {
        const [auth] = await this.auth.fromAuths().getContentAuthority(this.ctx.userId, contentId);
        checkAuthority(auth, Authority.READABLE);
        const contents = await this.con.fromContents().byEntityId(contentId).getFocusedMany(this.con, this.formats, auth);
        if (contents.length == 0) {
            throw new NotFoundEntity();
        }
        return contents[0].content;
    }

    private async _getContentRelations(spaceId: SpaceSk, formatId: FormatSk, contentId: ContentSk) {
        const relations = await this.formats.getRelations(formatId);
        const promises = relations.map(async x => {
            const container = await this.containers.fromContainers().bySpaceAndFormat(spaceId, x.format.id).getOne();
            if (container) {
                const contents = await this.con.fromContents().byProperty(container.id, x.property.id, contentId).getRelatedMany(this.con, this.formats, Authority.READABLE);
                if (contents.length > 0) {
                    return { relation: { contentCount: x.contentCount, property: x.property, formatId: x.format.entityId }, contents };
                } else {
                    return null;
                }
            } else {
                return null;
            }
        });
        const contentRelations = await Promise.all(promises);
        return contentRelations.filter(notNull);
    }

    async getContentPage(contentId: ContentId): Promise<IntactContentPage> {
        const [auth] = await this.auth.fromAuths().getContentAuthority(this.ctx.userId, contentId);
        checkAuthority(auth, Authority.READABLE);

        const contents = await this.con.fromContents().byEntityId(contentId).getFocusedMany(this.con, this.formats, auth);
        if (contents.length == 0) {
            throw new NotFoundEntity();
        }
        const content = contents[0];

        const [makeDraft, comments, relations] = await Promise.all([
            this.ctx.userId ? this.edit.fromDrafts().byUser(this.ctx.userId).byContent(content.raw.id).selectRelated().getOne() : null,
            this.com.fromComments().byContent(content.raw.id).getFocusedTreeMany(),
            this._getContentRelations(content.formatRaw.space.id, content.formatRaw.id, content.raw.id)
        ]);
        return {
            content: content.content,
            draft: makeDraft ? makeDraft(content.format) : null,
            comments,
            relations
        };
    }

    async getRelatedContent(contentId: ContentId): Promise<RelatedContent> {
        const [auth] = await this.auth.fromAuths().getContentAuthority(this.ctx.userId, contentId);
        checkAuthority(auth, Authority.READABLE);

        const contents = await this.con.fromContents().byEntityId(contentId).getRelatedMany(this.con, this.formats, auth);
        if (contents.length == 0) {
            throw new NotFoundEntity();
        }
        return contents[0];
    }

    async getContents(spaceId: SpaceId, formatId: FormatId): Promise<RelatedContent[]> {
        const [auth] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
        checkSpaceAuthority(auth, SpaceAuthority.READABLE);

        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byEntityId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byEntityId(formatId).selectId().getNeededOne()
        ]);
        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
        return await this.con.fromContents().byContainer(containerSk).getRelatedMany(this.con, this.formats, getAuthority(auth));
    }
    /*
        async getContentsByProperty(spaceId: SpaceId, formatId: FormatId, propertyId: PropertyId, value: string): Promise<RelatedContent[]> {
    
            const [auth] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.READABLE);
            
            const [spaceSk, formatSk] = await Promise.all([
                await this.spaces.fromSpaces().byEntityId(spaceId).selectId().getNeededOne(),
                await this.formats.fromFormats().byEntityId(formatId).selectId().getNeededOne()
            ]);
            const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
            return await this.con.fromContents().byProperty(containerSk, propertyId, value).getRelatedMany(this.con, this.formats);
        }
    */
    async getContentsByDisplayId(spaceId: SpaceDisplayId, formatId: FormatDisplayId): Promise<RelatedContent[]> {
        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byDisplayId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byDisplayId(formatId).selectId().getNeededOne()
        ]);

        const [auth] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceSk);
        checkSpaceAuthority(auth, SpaceAuthority.READABLE);

        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
        return await this.con.fromContents().byContainer(containerSk).getRelatedMany(this.con, this.formats, getAuthority(auth));
    }

    async getFocusedContentsByDisplayId(spaceId: SpaceDisplayId, formatId: FormatDisplayId): Promise<FocusedContent[]> {
        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byDisplayId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byDisplayId(formatId).selectId().getNeededOne()
        ]);

        const [auth] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceSk);
        checkSpaceAuthority(auth, SpaceAuthority.READABLE);

        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).selectId().getNeededOne();
        const contents = await this.con.fromContents().byContainer(containerSk).getFocusedMany(this.con, this.formats, getAuthority(auth))
        return contents.map(x => x.content);
    }

    async getMyContentDrafts(): Promise<RelatedContentDraft[]> {
        const userId = this.ctx.getAuthorized();
        const drafts = await this.edit.fromDrafts().byUser(userId).getRelatedMany(this.con, this.formats, this.matEdit);
        return drafts;
    }

    async getContentDraft(draftId: ContentDraftId): Promise<FocusedContentDraft> {
        const userId = this.ctx.getAuthorized();
        const drafts = await this.edit.fromDrafts().byEntityId(draftId).getFocusedMany(this.con, this.formats, this.matEdit);
        if (drafts.length == 0) {
            throw new NotFoundEntity();
        }
        const draft = drafts[0];
        if (draft.raw.userId != userId) {
            throw new LackOfAuthority();
        }
        return draft.draft;
    }

    async cancelContentDraft(draftId: ContentDraftId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts().byEntityId(draftId).getNeededOne();
            if (draft.userId != userId) {
                throw new LackOfAuthority();
            }
            if (draft.state == ContentDraftState.EDITING) {
                this.edit.createCommand(trx).cancelEditing(draft);
                const materials = await this.matEdit.fromDrafts().byContentDraft(draft).getMany();
                const promises = materials.map(x => this.matEdit.createCommand(trx).closeEditing(x, MaterialEditingState.CANCELD));
                await Promise.all(promises);
            }
            return {};
        });
    }

    async getContentCommits(contentId: ContentId): Promise<RelatedContentCommit[]> {
        const [auth, content] = await this.auth.fromAuths().getContentAuthority(this.ctx.userId, contentId);
        checkAuthority(auth, Authority.READABLE);
        return await this.con.fromCommits().byContent(content.id).selectRelated().getMany();
    }

    async getContentCommit(commitId: ContentCommitId): Promise<FocusedContentCommit> {
        const commit = await this.con.fromCommits().byEntityId(commitId).selectFocused().getNeededOne();
        const [auth] = await this.auth.fromAuths().getContentAuthority(this.ctx.userId, commit.contentId);
        checkAuthority(auth, Authority.READABLE);
        return commit;
    }

    private async getSearchedContent(results: HitContent[]) {
        if (results.length == 0) {
            return [];
        }
        const contents = await this.con.fromContents().inEntityId(results.map(x => x.contentId)).getRelatedMany(this.con, this.formats, Authority.READABLE);
        const resultMap = mapByString(results, x => x.contentId);
        return contents.map(x => {
            const result = resultMap[x.contentId];
            return { content: x, score: result.score, highlights: result.highlights }
        })
    }

    async getSearchedAllContents(text: string): Promise<SearchedContent[]> {
        const userId = this.ctx.getAuthorized();
        const containers = await this.auth.fromAuths().getReadableContainers(userId);
        const results = await this.index.searchAllContents(text, containers.map(x => x.entityId));
        return await this.getSearchedContent(results);
    }

    async getSearchedContentsInContainer(spaceId: SpaceDisplayId, formatId: FormatDisplayId, text: string): Promise<SearchedContent[]> {
        const userId = this.ctx.getAuthorized();
        const [spaceSk, formatSk] = await Promise.all([
            await this.spaces.fromSpaces().byDisplayId(spaceId).selectId().getNeededOne(),
            await this.formats.fromFormats().byDisplayId(formatId).selectId().getNeededOne()
        ]);
        const container = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatSk).getNeededOne();
        const results = await this.index.searchContentsInContainer(text, container.entityId);
        return await this.getSearchedContent(results);
    }
}