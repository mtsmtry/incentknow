import { ObjectLiteral } from "typeorm";
import { ContentId, ContentSk } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentDraftId, ContentDraftSk } from "../../entities/content/ContentDraft";
import { FormatId } from "../../entities/format/Format";
import { StructureId, StructureSk } from "../../entities/format/Structure";
import { MaterialId } from "../../entities/material/Material";
import { SpaceAuth, SpaceId } from "../../entities/space/Space";
import { Data, DataKind, DataMember } from "../../Implication";
import { FocusedContent, RelatedContent } from "../../interfaces/content/Content";
import { FocusedContentCommit, RelatedContentCommit } from "../../interfaces/content/ContentCommit";
import { FocusedContentDraft, RelatedContentDraft } from "../../interfaces/content/ContentDraft";
import { ContentNode } from "../../interfaces/content/ContentNode";
import { ContentWholeRevisionId, FocusedContentRevision, RelatedContentRevision, toContentWholeRevisionStructure } from "../../interfaces/content/ContentRevision";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { ContentCommitRepository } from "../../repositories/implements/content/ContentCommitRepository";
import { ContentEditingRepository } from "../../repositories/implements/content/ContentEditingRepository";
import { ContentRepository } from "../../repositories/implements/content/ContentRepository.";
import { ContentRevisionRepository } from "../../repositories/implements/content/ContentRevisionRepository.";
import { FormatRepository } from "../../repositories/implements/format/FormatRepository";
import { MaterialEditingRepository } from "../../repositories/implements/material/MaterialEditingRepository";
import { MaterialRepository } from "../../repositories/implements/material/MaterialRepository";
import { MaterialRevisionRepository } from "../../repositories/implements/material/MaterialRevisionRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../../repositories/implements/space/SpaceRepository";
import { ContentDraftQuery } from "../../repositories/queries/content/ContentDraftQuery";
import { mapBy, notNull } from "../../utils";
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
        private com: ContentCommitRepository,
        private rev: ContentRevisionRepository,
        private mat: MaterialRepository,
        private matEdit: MaterialEditingRepository,
        private matRev: MaterialRevisionRepository,
        private spaces: SpaceRepository,
        private containers: ContainerRepository,
        private formats: FormatRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    private async _getFocusedContentDraftWhole(qb: ContentDraftQuery) {
        const getAttributedMaterialDrafts = async (contentId: ContentSk | null) => {
            if (!contentId) {
                return [];
            }
            const materials = await this.mat.fromMaterials().byContent(contentId).selectRelated().getManyWithRaw();
            const materialMap = mapBy(materials, x => x.raw.id);
            const materialDrafts = await this.matEdit.fromDrafts().byMaterials(materials.map(x => x.raw.id)).selectFocused().getManyWithRaw();
            return materialDrafts.map(x => x.result ? x.result(materialMap[x.raw.id].result) : null).filter(notNull);
        };

        const getMaterialDrafts = async (draftId: ContentDraftSk) => {
            const materialDrafts = await this.matEdit.fromDrafts().byIntendedContentDraft(draftId).selectFocused().getMany();
            return materialDrafts.filter(notNull).map(x => x(null));
        };

        const [buildDraft, draftRaw] = await qb.selectFocused().getOneWithRaw();
        if (!buildDraft || !draftRaw) {
            return null;
        }
        const [materialDrafts1, materialDrafts2] = await Promise.all([
            getAttributedMaterialDrafts(draftRaw.contentId),
            getMaterialDrafts(draftRaw.id)
        ]);

        const format = await this.formats.fromStructures().byId(draftRaw.structureId).selectFocusedFormat().getNeededOne();
        return buildDraft(format, materialDrafts1.concat(materialDrafts2));
    }

    private async _getFocusedRevisionById(id: ContentWholeRevisionId) {
        const strc = toContentWholeRevisionStructure(id);
        const contentPromise = await this.rev.fromRevisions().getFocusedOneById(strc.content);
        const materialPromises = Promise.all(strc.materials.map(id => this.matRev.fromRevisions().getFocusedOneById(id)));
        const [buildContent, materials] = await Promise.all([contentPromise, materialPromises]);
        return buildContent ? buildContent(materials.filter(notNull)) : null;
    }

    async startContentEditing(contentId: ContentId, basedCommitId: ContentCommitId | null): Promise<ContentDraftId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const contentSk = await this.con.fromContents(trx).byEntityId(contentId).selectId().getNeededOne();
            const basedCommit = basedCommitId ? await this.com.fromCommits(trx).byEntityId(basedCommitId).getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, contentSk, basedCommit);
            return draft.raw.entityId;
        });
    }

    async createNewContentDraft(structureId: StructureId, spaceId: SpaceId | null, data: ObjectLiteral | null): Promise<ContentDraftId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const spaceSk = spaceId ? await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne() : null;
            const structureSk = await this.formats.fromStructures(trx).byEntityId(structureId).selectId().getNeededOne();
            const draft = await this.edit.createCommand(trx).createActiveBlankDraft(userId, structureSk, spaceSk, data);
            return draft.raw.entityId;
        });
    }

    async editContentDraft(contentDraftId: ContentDraftId, data: any): Promise<RelatedContentRevision | null> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(contentDraftId).selectRaw().getNeededOne();
            if (!draft.currentEditingId) {
                throw new WrongTargetState("The state of this material draft is not editing");
            }
            await this.edit.createCommand(trx).updateDraft(draft, data);
            return null;
        });
    }

    async commitContent(contentDraftId: ContentDraftId, data: any): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts().byEntityId(contentDraftId).selectRaw().getNeededOne();
            if (!draft.currentEditingId || !draft.data) {
                throw new WrongTargetState();
            }
            const editing = await this.edit.fromEditings().byId(draft.currentEditingId).getNeededOne();

            const [format, structure] = await this.formats.fromStructures(trx).byId(draft.structureId).selectFocusedFormat().getNeededOneWithRaw();

            if (draft.contentId) {
                const [auth, material] = await this.auth.fromAuths(trx).getContentAuth(SpaceAuth.WRITABLE, userId, draft.contentId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const [_2, commit, _3] = await Promise.all([
                    this.edit.createCommand(trx).commitEditing(draft),
                    this.com.createCommand(trx).commitContent(userId, draft.contentId, draft.structureId, draft.data, editing.basedCommitId, draft.currentEditingId),
                    this.con.createCommand(trx).updateContent(userId, draft.contentId, draft.data)
                ]);
                return {};
            } else if (draft.intendedSpaceId) {
                if (!draft.data) {
                    throw new WrongTargetState();
                }
                const [auth, _] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, draft.intendedSpaceId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const container = await this.containers.createCommand(trx).getOrCreate(draft.intendedSpaceId, structure.formatId);
                const content = await this.con.createCommand(trx).createContent(container.id, draft.structureId, userId, draft.data);
                const [_2, commit, _3] = await Promise.all([
                    this.edit.createCommand(trx).commitEditing(draft),
                    this.com.createCommand(trx).commitContent(userId, content.raw.id, draft.structureId, draft.data, editing.basedCommitId, draft.currentEditingId),
                    this.con.createCommand(trx).updateContent(userId, content.raw.id, draft.data)
                ]);
                return {};
            } else {
                throw new InternalError();
            }
        });
    }

    async getContent(contentId: ContentId): Promise<FocusedContent> {
        const userId = this.ctx.getAuthorized();
        const [buildContent, rawContent] = await this.con.fromContents().byEntityId(contentId).selectFocused().getNeededOneWithRaw();
        const buildDraft = await this.edit.fromDrafts().byUser(userId).byContent(rawContent.id).selectRelated().getNeededOne();
        const format = await this.formats.fromStructures().byId(rawContent.structureId).selectFocusedFormat().getNeededOne();
        const draft = buildDraft ? buildDraft(format) : null;
        return buildContent(format, draft);
    }

    async getRelatedContent(contentId: ContentId): Promise<RelatedContent> {
        const userId = this.ctx.getAuthorized();
        const [buildContent, rawContent] = await this.con.fromContents().byEntityId(contentId).selectRelated().getNeededOneWithRaw();
        const format = await this.formats.fromStructures().byId(rawContent.structureId).selectFocusedFormat().getNeededOne();
        return buildContent(format);
    }

    async getContents(spaceId: SpaceId, formatId: FormatId): Promise<RelatedContent[]> {
        const userId = this.ctx.getAuthorized();
        const spaceSk = await this.spaces.fromSpaces().byEntityId(spaceId).selectId().getNeededOne();
        const [format, formatRaw] = await this.formats.fromFormats().byEntityId(formatId).selectFocused().getNeededOneWithRaw();
        const containerSk = await this.containers.fromContainers().bySpaceAndFormat(spaceSk, formatRaw.id).selectId().getNeededOne();
        const getContents = await this.con.fromContents().byContainer(containerSk).selectRelated().getMany();
        return getContents.map(x => x(format));
    }

    async getMyContentDrafts(): Promise<RelatedContentDraft[]> {
        const userId = this.ctx.getAuthorized();
        const drafts = await this.edit.fromDrafts().byUser(userId).selectRelated().getManyWithRaw();
        const structIds = Array.from(new Set(drafts.map(x => x.raw.structureId)));
        const getFormat = (structId: StructureSk) => this.formats.fromStructures().byId(structId).selectFocusedFormat().getNeededOne();
        const structs = await Promise.all(structIds.map(async x => {
            const format = await getFormat(x);
            return { format, id: x };
        }));
        const structMap = mapBy(structs, x => x.id);
        return drafts.map(x => x.result(structMap[x.raw.structureId].format));
    }

    async getContentDraft(draftId: ContentDraftId): Promise<FocusedContentDraft> {
        const userId = this.ctx.getAuthorized();
        const draft = await this._getFocusedContentDraftWhole(this.edit.fromDrafts().byEntityId(draftId))
        if (!draft) {
            throw new NotFoundEntity();
        }
        return draft;
    }

    async getContentCommits(contentId: ContentId): Promise<RelatedContentCommit[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, content] = await this.auth.fromAuths().getContentAuth(SpaceAuth.READABLE, userId, contentId);
        return await this.com.fromCommits().byContent(content.id).selectRelated().getMany();
    }

    // include snapshot
    async getContentEditingNodes(draftId: ContentDraftId): Promise<ContentNode[]> {
        const userId = this.ctx.getAuthorized();
        const draft = await this.edit.fromDrafts().byEntityId(draftId).getNeededOne();
        if (draft.userId != userId) {
            throw new LackOfAuthority();
        }
        return [];//return await this.rev.fromNodes().getManyByDraft(draft.id);
    }

    async getContentRevision(revisionId: ContentWholeRevisionId): Promise<FocusedContentRevision> {
        const revision = await this._getFocusedRevisionById(revisionId);
        if (!revision) {
            throw new NotFoundEntity();
        }
        return revision;
    }

    async getContentCommit(commitId: ContentCommitId): Promise<FocusedContentCommit> {
        return await this.com.fromCommits().byEntityId(commitId).selectFocused().getNeededOne();
    }
}