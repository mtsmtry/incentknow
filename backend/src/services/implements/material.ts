import { MaterialId, MaterialType } from '../../entities/material/material';
import { MaterialCommitId } from '../../entities/material/material_commit';
import { MaterialDraftId } from '../../entities/material/material_draft';
import { MaterialEditingState } from '../../entities/material/material_editing';
import { SpaceAuth, SpaceId } from '../../entities/space/space';
import { FocusedMaterial } from '../../interfaces/material/material';
import { FocusedMaterialCommit, RelatedMaterialCommit } from '../../interfaces/material/material_commit';
import { FocusedMaterialDraft, RelatedMaterialDraft } from '../../interfaces/material/material_draft';
import { MaterialNode } from '../../interfaces/material/material_node';
import { FocusedMaterialRevision, MaterialRevisionId, RelatedMaterialRevision } from '../../interfaces/material/material_revision';
import { ContentRepository } from '../../repositories/implements/content/content';
import { ContentEditingRepository } from '../../repositories/implements/content/content_editing';
import { MaterialRepository } from '../../repositories/implements/material/material';
import { MaterialCommitRepository } from '../../repositories/implements/material/material_commit';
import { MaterialEditingRepository } from '../../repositories/implements/material/material_editing';
import { MaterialRevisionRepository } from '../../repositories/implements/material/material_revision';
import { AuthorityRepository } from '../../repositories/implements/space/authority';
import { SpaceRepository } from '../../repositories/implements/space/space';
import { AuthenticatedService } from '../authenticated_service';

class MaterialService extends AuthenticatedService {
    constructor(
        private mat: MaterialRepository,
        private edit: MaterialEditingRepository,
        private rev: MaterialRevisionRepository,
        private com: MaterialCommitRepository,
        private contents: ContentRepository,
        private contentEdit: ContentEditingRepository,
        private spaces: SpaceRepository,
        private auth: AuthorityRepository) {
        super()
    }

    async startMaterialEditing(materialId: MaterialId, forkedCommitId: MaterialCommitId | null): Promise<RelatedMaterialDraft> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const materialSk = await this.mat.fromMaterials(trx).byEntityId(materialId).selectId().getNeededOne();
            const forkedCommit = forkedCommitId ? await this.com.fromCommits(trx).byEntityId(forkedCommitId).getNeededOne() : null;
            const draft = await this.edit.createCommand(trx).getOrCreateActiveDraft(userId, materialSk, forkedCommit);
            return await draft.getRelated();
        });
    }

    async startBlankMaterialEditing(spaceId: SpaceId, type: MaterialType): Promise<RelatedMaterialDraft> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const spaceSk = await this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne();
            const draft = await this.edit.createCommand(trx).getOrCreateActiveBlankDraft(userId, spaceSk, type);
            return await draft.getRelated();
        });
    }

    async editMaterial(materialDraftId: MaterialDraftId, data: string): Promise<RelatedMaterialRevision | null> {
        return await this.transactionAuthorized(async (trx, userId) => {
            // get user
            const user = await this.getMyUser();

            // get draft
            const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).getNeededOne();
            this.validate(draft.currentEditingId != null, "The state of this material draft is not editing");

            // update content draft
            if (draft.intendedContentDraftId) {
                await this.contentEdit.createCommand(trx).updateDraftTimestamp(draft.intendedContentDraftId);
            }

            await this.edit.createCommand(trx).updateDraft(draft, data);

            return null;
        })
    }

    async commitMaterial(materialDraftId: MaterialDraftId): Promise<RelatedMaterialRevision> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).getNeededOne();
            if (!draft.currentEditingId || !draft.data) {
                throw new WrongTargetState();
            }

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
                    this.com.createCommand(trx).commitMaterial(userId, draft.materialId, draft.data, draft.basedCommitId, draft.currentEditingId),
                    this.mat.createCommand(trx).updateMaterial(userId, draft.materialId, draft.data)
                ]);

            } else if (draft.intendedSpaceId && draft.intendedMaterialType) {
                if (!draft.data) {
                    throw new WrongTargetState();
                }
                const [auth, _] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, draft.intendedSpaceId);
                if (!auth) {
                    throw new LackOfAuthority();
                }

                const material = await this.mat.createCommand(trx).createMaterialInSpace(draft.intendedSpaceId, userId, draft.data, draft.intendedMaterialType);
                await Promise.all([
                    this.edit.createCommand(trx).closeEditing(draft, MaterialEditingState.COMMITTED),
                    this.com.createCommand(trx).commitMaterial(userId, material.raw.id, draft.data, draft.basedCommitId, draft.currentEditingId),
                    this.mat.createCommand(trx).updateMaterial(userId, material.raw.id, draft.data)
                ]);
            }
            throw new InternalError();
        });
    }

    async getMaterial(materialId: MaterialId): Promise<FocusedMaterial> {
        const userId = this.getAuthorized();
        const [buildMaterial, rawMaterial] = await this.mat.fromMaterials().byEntityId(materialId).selectFocused().getNeededOneWithRaw();
        const draft = await this.edit.fromDrafts().byUser(userId).byMaterial(rawMaterial.id).selectRelated().getNeededOne();
        return buildMaterial(draft);
    }

    async getMyMaterialDrafts(): Promise<RelatedMaterialDraft[]> {
        const userId = this.getAuthorized();
        return await this.edit.fromDrafts().byUser(userId).selectRelated().getMany();
    }

    async getMaterialDraft(draftId: MaterialDraftId): Promise<FocusedMaterialDraft> {
        const userId = this.getAuthorized();
        const [buildDraft, rawDraft] = await this.edit.fromDrafts().byEntityId(draftId).selectFocused().getNeededOneWithRaw();
        if (!buildDraft) {
            throw new WrongTargetState();
        }
        if (rawDraft.userId != userId) {
            throw new LackOfAuthority();
        }
        const material = rawDraft.materialId ? await this.mat.fromMaterials().byId(rawDraft.materialId).selectRelated().getOne() : null;
        return buildDraft(material);
    }

    async getMaterialCommits(materialId: MaterialId): Promise<RelatedMaterialCommit[]> {
        const userId = this.getAuthorized();
        const material = await this.mat.fromMaterials().byEntityId(materialId).getNeededOne();
        if (material.spaceId) {
            const space = await this.spaces.fromSpaces().byId(material.spaceId).getNeededOne();
            await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.READABLE, userId, space);
        }
        return await this.com.fromCommits().byMaterial(material.id).selectRelated().getMany();
    }

    async getMaterialEditingNodes(draftId: MaterialDraftId): Promise<MaterialNode[]> {
        const userId = this.getAuthorized();
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