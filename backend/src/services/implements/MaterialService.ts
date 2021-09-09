import { MaterialId, MaterialType } from '../../entities/material/Material';
import { MaterialCommitId } from '../../entities/material/MaterialCommit';
import { MaterialDraftId } from '../../entities/material/MaterialDraft';
import { MaterialEditingState } from '../../entities/material/MaterialEditing';
import { MaterialSnapshotId } from '../../entities/material/MaterialSnapshot';
import { SpaceAuth, SpaceId } from '../../entities/space/Space';
import { FocusedMaterial, MaterialData, toMaterialData } from '../../interfaces/material/Material';
import { FocusedMaterialCommit, RelatedMaterialCommit } from '../../interfaces/material/MaterialCommit';
import { FocusedMaterialDraft, RelatedMaterialDraft } from '../../interfaces/material/MaterialDraft';
import { IntactMaterialEditing } from '../../interfaces/material/MaterialEditing';
import { FocusedMaterialSnapshot } from '../../interfaces/material/MaterialSnapshot';
import { ContentEditingRepository } from '../../repositories/implements/content/ContentEditingRepository';
import { ContentRepository } from '../../repositories/implements/content/ContentRepository.';
import { MaterialEditingRepository } from '../../repositories/implements/material/MaterialEditingRepository';
import { MaterialRepository } from '../../repositories/implements/material/MaterialRepository';
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
        private contents: ContentRepository,
        private contentEdit: ContentEditingRepository,
        private spaces: SpaceRepository,
        private auth: AuthorityRepository) {
        super(ctx)
    }

    async startMaterialEditing(materialId: MaterialId, basedCommitId: MaterialCommitId | null): Promise<RelatedMaterialDraft> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const material = await this.mat.fromMaterials(trx).byEntityId(materialId).joinCommitAndSelectData().getNeededOne();
            const basedCommit = basedCommitId ? await this.mat.fromCommits(trx).byEntityId(basedCommitId).getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, material.id, toMaterialData(material.materialType, material.commit.data), basedCommit);
            return await draft.getRelated();
        });
    }

    async createNewMaterialDraft(spaceId: SpaceId | null, materialData: MaterialData): Promise<RelatedMaterialDraft> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const spaceSk = spaceId ? await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).createActiveBlankDraft(userId, spaceSk, materialData);
            return await draft.getRelated();
        });
    }

    async editMaterialDraft(materialDraftId: MaterialDraftId, materialData: MaterialData): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).joinSnapshotAndSelectData().getNeededOne();
            if (!draft.currentEditingId) {
                throw new WrongTargetState("The state of this material draft is not editing");
            }

            // update content draft
            if (draft.intendedContentDraftId) {
                await this.contentEdit.createCommand(trx).updateDraftTimestamp(draft.intendedContentDraftId);
            }

            await this.edit.createCommand(trx).updateDraft(draft, materialData);

            return {};
        })
    }

    async commitMaterial(materialDraftId: MaterialDraftId, materialData: MaterialData): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).joinSnapshotAndSelectData().getNeededOne();
            const currentEditing = draft.currentEditing;
            if (!currentEditing) {
                throw new WrongTargetState();
            }
            const editing = await this.edit.fromEditings().byId(currentEditing.id).getNeededOne();

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
                    this.mat.createCommand(trx).commitMaterial(userId, draft.materialId, materialData, editing.id)
                ]);

            } else if (draft.intendedSpaceId) {
                const [auth, _] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, draft.intendedSpaceId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const material = await this.mat.createCommand(trx).createMaterialInSpace(draft.intendedSpaceId, userId, toMaterialData(draft.intendedMaterialType, currentEditing.snapshot.data), editing.id);
                await Promise.all([
                    this.edit.createCommand(trx).makeDraftContent(draft.id, material.raw.id),
                    this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.COMMITTED)
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
        return await this.edit.fromDrafts().byUserOwn(userId).selectRelated().getMany();
    }

    async getMaterialDraft(draftId: MaterialDraftId): Promise<FocusedMaterialDraft> {
        const userId = this.ctx.getAuthorized();
        const [material, raw] = await this.edit.fromDrafts().byEntityId(draftId).selectFocused().getNeededOneWithRaw();
        if (raw.userId != userId) {
            throw new LackOfAuthority();
        }
        return material;
    }

    async getMaterialCommits(materialId: MaterialId): Promise<RelatedMaterialCommit[]> {
        const userId = this.ctx.getAuthorized();
        const material = await this.mat.fromMaterials().byEntityId(materialId).getNeededOne();
        if (material.spaceId) {
            const space = await this.spaces.fromSpaces().byId(material.spaceId).getNeededOne();
            await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.READABLE, userId, space);
        }
        return await this.mat.fromCommits().byMaterial(material.id).selectRelated().getMany();
    }

    async getMaterialEditings(draftId: MaterialDraftId): Promise<IntactMaterialEditing[]> {
        const userId = this.ctx.getAuthorized();
        const draft = await this.edit.fromDrafts().byEntityId(draftId).getNeededOne();
        if (draft.userId != userId) {
            throw new LackOfAuthority();
        }
        return await this.edit.fromEditings().byDraft(draft.id).selectIntact().getMany();
    }

    async getMaterialSnapshot(snapshotId: MaterialSnapshotId): Promise<FocusedMaterialSnapshot> {
        const snapshot = await this.edit.fromSnapshots().byEntityId(snapshotId).selectFocused().getNeededOne();
        if (!snapshot) {
            throw new NotFoundEntity();
        }
        return snapshot;
    }

    async getMaterialCommit(commitId: MaterialCommitId): Promise<FocusedMaterialCommit> {
        return await this.mat.fromCommits().byEntityId(commitId).selectFocused().getNeededOne();
    }
}