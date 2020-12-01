import { ContentId, ContentSk } from "../../entities/content/content";
import { ContentCommitId } from "../../entities/content/content_commit";
import { ContentDraftId, ContentDraftSk } from "../../entities/content/content_draft";
import { ContentEditingState } from "../../entities/content/content_editing";
import { MaterialId } from "../../entities/material/material";
import { SpaceAuth, SpaceId } from "../../entities/space/space";
import { Data, DataKind, DataMember } from "../../implication";
import { FocusedContent } from "../../interfaces/content/content";
import { FocusedContentCommit, RelatedContentCommit } from "../../interfaces/content/content_commit";
import { FocusedContentDraft, RelatedContentDraft } from "../../interfaces/content/content_draft";
import { ContentNode } from "../../interfaces/content/content_node";
import { ContentWholeRevisionId, FocusedContentRevision, RelatedContentRevision, toContentWholeRevisionId, toContentWholeRevisionStructure } from "../../interfaces/content/content_revision";
import { ContainerRepository } from "../../repositories/implements/container/container";
import { ContentRepository } from "../../repositories/implements/content/content";
import { ContentCommitRepository } from "../../repositories/implements/content/content_commit";
import { ContentEditingRepository } from "../../repositories/implements/content/content_editing";
import { ContentRevisionRepository } from "../../repositories/implements/content/content_revision";
import { FormatRepository } from "../../repositories/implements/format/format";
import { MaterialRepository } from "../../repositories/implements/material/material";
import { MaterialEditingRepository } from "../../repositories/implements/material/material_editing";
import { MaterialRevisionRepository } from "../../repositories/implements/material/material_revision";
import { AuthorityRepository } from "../../repositories/implements/space/authority";
import { SpaceRepository } from "../../repositories/implements/space/space";
import { ContentDraftQuery } from "../../repositories/queries/content/content_draft";
import { AuthenticatedService } from "../authenticated_service";

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

class ContentService extends AuthenticatedService {
    constructor(
        private con:        ContentRepository,
        private edit:       ContentEditingRepository,
        private com:        ContentCommitRepository,
        private rev:        ContentRevisionRepository,
        private mat:        MaterialRepository,
        private matEdit:    MaterialEditingRepository,
        private matRev:     MaterialRevisionRepository,
        private spaces:     SpaceRepository,
        private containers: ContainerRepository,
        private formats:    FormatRepository,
        private auth:       AuthorityRepository) {
        super();
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

        return buildDraft(materialDrafts1.concat(materialDrafts2));
    }

    private async _getFocusedRevisionById(id: ContentWholeRevisionId) {
        const strc = toContentWholeRevisionStructure(id);
        const contentPromise = await this.rev.fromRevisions().getFocusedOneById(strc.content);
        const materialPromises = Promise.all(strc.materials.map(id => this.matRev.fromRevisions().getFocusedOneById(id)));
        const [buildContent, materials] = await Promise.all([contentPromise, materialPromises]);
        return buildContent ? buildContent(materials.filter(notNull)) : null;
    }

    async startContentEditing(contentId: ContentId, forkedCommitId: ContentCommitId | null): Promise<RelatedContentDraft> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const contentSk = await this.con.fromContents(trx).byEntityId(contentId).selectId().getNeededOne();
            const forkedCommit = forkedCommitId ? await this.com.fromCommits(trx).byEntityId(forkedCommitId).getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, contentSk, forkedCommit);
            return await draft.getRelated();
        });
    }

    async startBlankContentEditing(spaceId: SpaceId): Promise<RelatedContentDraft> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const spaceSk = await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne();
            const draft = await this.edit.createCommand(trx).getOrCreateActiveBlankDraft(userId, spaceSk);
            return await draft.getRelated();
        });
    }

    async editContent(contentDraftId: ContentDraftId, data: any): Promise<RelatedContentRevision | null> {
        return await this.transactionAuthorized(async (trx, userId) => {
            // get user
            const user = await this.getMyUser();

            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(contentDraftId).getNeededOne();
            this.validate(draft.currentEditingId != null, "The state of this material draft is not editing");

            await this.edit.createCommand(trx).updateDraft(draft, data);

            return null;
        });
    }

    async commitContent(contentDraftId: ContentDraftId, data: any): Promise<RelatedContentCommit | null> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts().byEntityId(contentDraftId).getNeededOne();
            if (!draft.currentEditingId || !draft.data) {
                throw new WrongTargetState();
            }

            const [format, structure] = await this.formats.fromStructures(trx).byId(draft.structureId).selectFocusedFormat().getNeededOneWithRaw();

            if (draft.contentId) {
                const [auth, material] = await this.auth.fromAuths(trx).getContentAuth(SpaceAuth.WRITABLE, userId, draft.contentId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                await Promise.all([
                    this.edit.createCommand(trx).closeEditing(draft, ContentEditingState.COMMITTED),
                    this.com.createCommand(trx).commitContent(userId, draft.contentId, draft.data, draft.basedCommitId, draft.currentEditingId),
                    this.con.createCommand(trx).updateContent(userId, draft.contentId, draft.data)
                ]);

            } else if (draft.intendedSpaceId) {
                if (!draft.data) {
                    throw new WrongTargetState();
                }
                const [auth, _] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, draft.intendedSpaceId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const container = await this.containers.fromContainers(trx).bySpaceAndFormat(draft.intendedSpaceId, structure.formatId).getNeededOne();
                const material = await this.con.createCommand(trx).createContent(container.id, draft.structureId, userId, draft.data);
                await Promise.all([
                    this.edit.createCommand(trx).closeEditing(draft, ContentEditingState.COMMITTED),
                    this.com.createCommand(trx).commitContent(userId, material.raw.id, draft.data, draft.basedCommitId, draft.currentEditingId),
                    this.con.createCommand(trx).updateContent(userId, material.raw.id, draft.data)
                ]);
            }
            throw new InternalError();
        });
    }

    async getContent(contentId: ContentId): Promise<FocusedContent> {
        const userId = this.getAuthorized();
        const [buildContent, rawContent] = await this.con.fromContents().byEntityId(contentId).selectFocused().getNeededOneWithRaw();
        const draft = await this.edit.fromDrafts().byUser(userId).byContent(rawContent.id).selectRelated().getNeededOne();
        const format = await this.formats.fromStructures().byId(rawContent.structureId).selectFocusedFormat().getNeededOne();
        return buildContent(format, draft);
    }

    async getMyContentDrafts(): Promise<RelatedContentDraft[]> {
        const userId = this.getAuthorized();
        return await this.edit.fromDrafts().byUser(userId).selectRelated().getMany();
    }

    async getContentDraft(draftId: ContentDraftId): Promise<FocusedContentDraft> {
        const userId = this.getAuthorized();
        const draft = await this._getFocusedContentDraftWhole(this.edit.fromDrafts().byEntityId(draftId))
        if (!draft) {
            throw new NotFoundEntity();
        }
        return draft;
    }

    async getContentCommits(contentId: ContentId): Promise<RelatedContentCommit[]> {
        const userId = this.getAuthorized();
        const [auth, content] = await this.auth.fromAuths().getContentAuth(SpaceAuth.READABLE, userId, contentId);
        return await this.com.fromCommits().byContent(content.id).selectRelated().getMany();
    }

    // include snapshot
    async getContentEditingNodes(draftId: ContentDraftId): Promise<ContentNode[]> {
        const userId = this.getAuthorized();
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