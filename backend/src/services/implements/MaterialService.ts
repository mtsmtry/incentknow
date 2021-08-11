import { MaterialId, MaterialType } from '../../entities/material/Material';
import { MaterialCommitId } from '../../entities/material/MaterialCommit';
import { MaterialDraftId } from '../../entities/material/MaterialDraft';
import { MaterialEditingState } from '../../entities/material/MaterialEditing';
import { SpaceAuth, SpaceId } from '../../entities/space/Space';
import { FocusedMaterial, MaterialData } from '../../interfaces/material/Material';
import { FocusedMaterialCommit, RelatedMaterialCommit } from '../../interfaces/material/MaterialCommit';
import { FocusedMaterialDraft, RelatedMaterialDraft } from '../../interfaces/material/MaterialDraft';
import { MaterialNode } from '../../interfaces/material/MaterialNode';
import { FocusedMaterialRevision, MaterialRevisionId, RelatedMaterialRevision } from '../../interfaces/material/MaterialRevision';
import { ContentEditingRepository } from '../../repositories/implements/content/ContentEditingRepository';
import { ContentRepository } from '../../repositories/implements/content/ContentRepository.';
import { MaterialCommitRepository } from '../../repositories/implements/material/MaterialCommitRepository';
import { MaterialEditingRepository } from '../../repositories/implements/material/MaterialEditingRepository';
import { MaterialRepository } from '../../repositories/implements/material/MaterialRepository';
import { MaterialRevisionRepository } from '../../repositories/implements/material/MaterialRevisionRepository';
import { AuthorityRepository } from '../../repositories/implements/space/AuthorityRepository';
import { SpaceRepository } from '../../repositories/implements/space/SpaceRepository';
import { BaseService } from '../BaseService';
import { InternalError, LackOfAuthority, NotFoundEntity, WrongTargetState } from '../Errors';
import { ServiceContext } from '../ServiceContext';

export class MaterialService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private mat: MaterialRepository,
        private edit: MaterialEditingRepository,
        private rev: MaterialRevisionRepository,
        private com: MaterialCommitRepository,
        private contents: ContentRepository,
        private contentEdit: ContentEditingRepository,
        private spaces: SpaceRepository,
        private auth: AuthorityRepository) {
        super(ctx)
    }

    async startMaterialEditing(materialId: MaterialId, basedCommitId: MaterialCommitId | null): Promise<RelatedMaterialDraft> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const material = await this.mat.fromMaterials(trx).byEntityId(materialId).selectAll().getNeededOne();
            const basedCommit = basedCommitId ? await this.com.fromCommits(trx).byEntityId(basedCommitId).getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, material.id, material.data, basedCommit);
            return await draft.getRelated();
        });
    }

    async createNewMaterialDraft(spaceId: SpaceId | null, type: MaterialType, materialData: MaterialData | null): Promise<RelatedMaterialDraft> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const data = materialData ? JSON.stringify(materialData.document) : null;

            const spaceSk = spaceId ? await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).createActiveBlankDraft(userId, spaceSk, type, data);
            return await draft.getRelated();
        });
    }

    async editMaterialDraft(materialDraftId: MaterialDraftId, materialData: MaterialData): Promise<RelatedMaterialRevision | null> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const data = JSON.stringify(materialData.document);

            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).selectRaw().getNeededOne();
            if (!draft.currentEditingId) {
                throw new WrongTargetState("The state of this material draft is not editing");
            }

            // update content draft
            if (draft.intendedContentDraftId) {
                await this.contentEdit.createCommand(trx).updateDraftTimestamp(draft.intendedContentDraftId);
            }

            await this.edit.createCommand(trx).updateDraft(draft, data);

            return null;
        })
    }

    async commitMaterial(materialDraftId: MaterialDraftId, materialData: MaterialData): Promise<RelatedMaterialRevision> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const data = JSON.stringify(materialData.document);

            const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).getNeededOne();
            if (!draft.currentEditingId || !draft.data) {
                throw new WrongTargetState();
            }
            const editing = await this.edit.fromEditings().byId(draft.currentEditingId).getNeededOne();

            if (draft.materialId) {
                const [auth, material] = await this.auth.fromAuths(trx).getMaterialAuth(SpaceAuth.WRITABLE, userId, draft.materialId);
                if (!auth) {
                    throw new LackOfAuthority();
                }
                if (material.contentId) {
                    await this.contents.createCommand(trx).updateContentTimestamp(material.contentId);
                }

                await Promise.all([
                    this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.COMMITTED),
                    this.com.createCommand(trx).commitMaterial(userId, draft.materialId, data, editing.basedCommitId, draft.currentEditingId),
                    this.mat.createCommand(trx).updateMaterial(userId, draft.materialId, data)
                ]);

            } else if (draft.intendedSpaceId) {
                if (!draft.data) {
                    throw new WrongTargetState();
                }
                const [auth, _] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, draft.intendedSpaceId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const material = await this.mat.createCommand(trx).createMaterialInSpace(draft.intendedSpaceId, userId, draft.data, MaterialType.DOCUMENT);
                await Promise.all([
                    this.edit.createCommand(trx).makeDraftContent(draft.id, material.raw.id),
                    this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.COMMITTED),
                    this.com.createCommand(trx).commitMaterial(userId, material.raw.id, data, editing.basedCommitId, draft.currentEditingId),
                    this.mat.createCommand(trx).updateMaterial(userId, material.raw.id, data)
                ]);
            }
            throw new InternalError();
        });
    }

    async getMaterial(materialId: MaterialId): Promise<FocusedMaterial> {
        const userId = this.ctx.getAuthorized();
        const [buildMaterial, rawMaterial] = await this.mat.fromMaterials().byEntityId(materialId).selectFocused().getNeededOneWithRaw();
        const draft = await this.edit.fromDrafts().byUser(userId).byMaterial(rawMaterial.id).selectRelated().getNeededOne();
        return buildMaterial(draft);
    }

    async getMyMaterialDrafts(): Promise<RelatedMaterialDraft[]> {
        const userId = this.ctx.getAuthorized();
        return await this.edit.fromDrafts().byUser(userId).selectRelated().getMany();
    }

    async getMaterialDraft(draftId: MaterialDraftId): Promise<FocusedMaterialDraft> {
        const userId = this.ctx.getAuthorized();
        const [buildDraft, rawDraft] = await this.edit.fromDrafts().byEntityId(draftId).selectFocused().getNeededOneWithRaw();
        if (rawDraft.userId != userId) {
            throw new LackOfAuthority();
        }
        const material = rawDraft.materialId ? await this.mat.fromMaterials().byId(rawDraft.materialId).selectRelated().getOne() : null;
        return buildDraft(material);
    }

    async getMaterialCommits(materialId: MaterialId): Promise<RelatedMaterialCommit[]> {
        const userId = this.ctx.getAuthorized();
        const material = await this.mat.fromMaterials().byEntityId(materialId).getNeededOne();
        if (material.spaceId) {
            const space = await this.spaces.fromSpaces().byId(material.spaceId).getNeededOne();
            await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.READABLE, userId, space);
        }
        return await this.com.fromCommits().byMaterial(material.id).selectRelated().getMany();
    }

    async getMaterialEditingNodes(draftId: MaterialDraftId): Promise<MaterialNode[]> {
        const userId = this.ctx.getAuthorized();
        const draft = await this.edit.fromDrafts().byEntityId(draftId).getNeededOne();
        if (draft.userId != userId) {
            throw new LackOfAuthority();
        }
        return await this.rev.fromNodes().getManyByDraft(draft.id);
    }

    async getMaterialRevision(revisionId: MaterialRevisionId): Promise<FocusedMaterialRevision> {
        const revision = await this.rev.fromRevisions().getFocusedOneById(revisionId);
        if (!revision) {
            throw new NotFoundEntity();
        }
        return revision;
    }

    async getMaterialCommit(commitId: MaterialCommitId): Promise<FocusedMaterialCommit> {
        return await this.com.fromCommits().byEntityId(commitId).selectFocused().getNeededOne();
    }
}