import { MaterialId } from '../../entities/material/Material';
import { MaterialCommitId } from '../../entities/material/MaterialCommit';
import { MaterialDraftId } from '../../entities/material/MaterialDraft';
import { MaterialEditingState } from '../../entities/material/MaterialEditing';
import { MaterialSnapshotId } from '../../entities/material/MaterialSnapshot';
import { SpaceAuthority, SpaceId } from '../../entities/space/Space';
import { Authority } from '../../interfaces/content/Content';
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
import { checkAuthority, checkSpaceAuthority } from '../../repositories/queries/space/AuthorityQuery';
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
            const [auth] = await this.auth.fromAuths().getMaterialAuthority(this.ctx.userId, materialId);
            checkAuthority(auth, Authority.WRITABLE);

            const material = await this.mat.fromMaterials(trx).byEntityId(materialId).joinCommitAndSelectData().getNeededOne();
            const basedCommit = basedCommitId ? await this.mat.fromCommits(trx).byEntityId(basedCommitId).getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, material.id, toMaterialData(material.materialType, material.commit.data), basedCommit);
            return await draft.getRelated();
        });
    }

    async createNewMaterialDraft(spaceId: SpaceId | null, materialData: MaterialData): Promise<RelatedMaterialDraft> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            if (spaceId) {
                const [auth] = await this.auth.fromAuths().getSpaceAuthority(userId, spaceId);
                checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);
            }

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

            if (draft.userId != userId) {
                throw new LackOfAuthority();
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
            const editing = await this.edit.fromEditings(trx).byId(currentEditing.id).getNeededOne();

            if (draft.materialId) {
                const [auth, material] = await this.auth.fromAuths(trx).getMaterialAuthority(this.ctx.userId, draft.materialId);
                checkAuthority(auth, Authority.WRITABLE);

                if (material.contentId) {
                    await this.contents.createCommand(trx).updateContentTimestamp(material.contentId);
                }

                await Promise.all([
                    this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.COMMITTED),
                    this.mat.createCommand(trx).commitMaterial(userId, draft.materialId, materialData, editing.id)
                ]);

            } else if (draft.intendedSpaceId) {
                const [auth] = await this.auth.fromAuths(trx).getSpaceAuthority(userId, draft.intendedSpaceId);
                checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

                const material = await this.mat.createCommand(trx).createMaterialInSpace(draft.intendedSpaceId, userId, toMaterialData(draft.intendedMaterialType, currentEditing.snapshot.data), editing.id);
                await Promise.all([
                    this.edit.createCommand(trx).makeDraftContent(draft.id, material.id),
                    this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.COMMITTED)
                ]);
            }
            throw new InternalError();
        });
    }

    async getMaterial(materialId: MaterialId): Promise<FocusedMaterial> {
        const [auth] = await this.auth.fromAuths().getMaterialAuthority(this.ctx.userId, materialId);
        checkAuthority(auth, Authority.WRITABLE);

        const [buildMaterial, rawMaterial] = await this.mat.fromMaterials().byEntityId(materialId).selectFocused().getNeededOneWithRaw();
        const draft = this.ctx.userId ? await this.edit.fromDrafts().byUser(this.ctx.userId).byMaterial(rawMaterial.id).selectRelated().getNeededOne() : null;
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

    async cancelMaterialDraft(draftId: MaterialDraftId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts().byEntityId(draftId).getNeededOne();
            if (draft.userId != userId) {
                throw new LackOfAuthority();
            }
            await this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.CANCELD);
            return {};
        });
    }

    async getMaterialCommits(materialId: MaterialId): Promise<RelatedMaterialCommit[]> {
        const [auth] = await this.auth.fromAuths().getMaterialAuthority(this.ctx.userId, materialId);
        checkAuthority(auth, Authority.READABLE);

        const material = await this.mat.fromMaterials().byEntityId(materialId).getNeededOne();
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
        const userId = this.ctx.getAuthorized();
        const [snapshot, raw] = await this.edit.fromSnapshots().byEntityId(snapshotId).joinEditingAndDraft().selectFocused().getNeededOneWithRaw();
        if (!snapshot) {
            throw new NotFoundEntity();
        }
        if (raw.editing.draft.userId != userId) {
            throw new LackOfAuthority();
        }
        return snapshot;
    }

    async getMaterialCommit(commitId: MaterialCommitId): Promise<FocusedMaterialCommit> {
        const [commit, raw] = await this.mat.fromCommits().byEntityId(commitId).selectFocused().getNeededOneWithRaw();

        const [auth] = await this.auth.fromAuths().getMaterialAuthority(this.ctx.userId, raw.materialId);
        checkAuthority(auth, Authority.READABLE);
        return commit;
    }
}