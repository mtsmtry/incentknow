import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { ChangeType, Content, ContentDraft, EditingState, Format, FormatUsage, Language, Material, MaterialCommit, MaterialDraft, MaterialEditing, MaterialSnapshot, MaterialType, MembershipMethod, MemberType, Property, Space, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { toFocusedContent, toFocusedFormatFromStructure, toFocusedMaterialCommit, toFocusedMaterial, toRelatedMaterial, toFocusedMaterialSnapshotFromCommit, RelatedMaterialSnapshot, toRelatedMaterialCommit, toFocusedMaterialDraft, toRelatedMaterialDraft, RelatedMaterialDraft, RelatedMaterialCommit, toRelatedMaterialSnapshotFromSnapshot, toFocusedMaterialSnapshotFromSnapshot, FocusedMaterialSnapshot, FocusedMaterialCommit, MaterialNode, toMaterialNodes, SnapshotSource, toFocusedContentSnapshotFromDraft, toFocusedMaterialSnapshotFromDraft, FocusedMaterialDraft, FocusedMaterial, MaterialId, SpaceId, MaterialDraftId, MaterialCommitId, MaterialSnapshotId, toMaterialSnapshotStructure } from './utils_entities';
import { timeStamp } from 'console';
import { MaterialRepository } from './../repositories/material'; 
import { MaterialEditingRepository } from './../repositories/material_editing'; 
import { SpaceRepository } from '../repositories/space';
import { MaterialRevisionRepository } from '../repositories/material_revision';
import { MaterialRevisionId } from '../interfaces/material/material_revision';
import { AuthenticatedService } from './authenticated_service';
import { SpaceAuth } from '../entities/space/space';

class MaterialService extends AuthenticatedService {
    constructor(
        private mat: MaterialRepository,
        private edit: MaterialEditingRepository,
        private rev: MaterialRevisionRepository,
        private spaces: SpaceRepository) {
        super()
    }

    async startMaterialEditing(materialId: MaterialId, forkedCommitId: MaterialCommitId | null): Promise<RelatedMaterialDraft> {
        const user = await this.getMyUser();
        const material = await this.mat.fromMaterials().byEntityId(materialId).getOne();
        const forkedCommit = forkedCommitId ? await this.mat.fromCommits().byEntityId(forkedCommitId).getOne() : null;
        
        const draft = this.edit.getOrCreateActiveDraft(user, material, forkedCommit);

        return toRelatedMaterialDraft(draft);
    }

    async startBlankMaterialEditing(spaceId: SpaceId, displayName: string, type: MaterialType): Promise<RelatedMaterialDraft> {
        const user = await this.getMyUser();
        const space = await this.spaces.fromSpaces().byEntityId(spaceId).getOne()
        const draft = await this.edit.getOrCreateActiveBlankDraft(user, space, displayName, type);
        return toRelatedMaterialDraft(draft);
    }

    async editMaterial(materialDraftId: MaterialDraftId, data: string): Promise<RelatedMaterialSnapshot | null> {

        // get user
        const user = await this.getMyUser();

        // get draft
        const draft = await this.edit.fromDrafts().byEntityId(materialDraftId).getOne();

        if (!draft) {
            throw "The specified material draft does not exists";
        } else if (!draft.currentEditingId) {
            throw "The state of this material draft is not editing";
        }

        // update content draft
        if (draft.intendedContentDraftId) {
            await ContentDraft.update(draft.intendedContentDraftId, { updatedAt: Date.now() });
        }

        this.edit.updateDraft(draft, data);

        return null;
    }

    async commitMaterial(materialDraftId: MaterialDraftId, data: string): Promise<RelatedMaterialCommit | null> {

        // get user
        const user = await this.getMyUser();

        // get draft
        const draft = await MaterialDraft
            .createQueryBuilder("editing")

            .leftJoinAndSelect("draft.material", "material")

            .leftJoinAndSelect("material.space", "space")
            .leftJoinAndSelect("material.content", "content")
            .leftJoinAndSelect("content1.container", "container1")
            .leftJoinAndSelect("container1.space", "space1")

            .leftJoinAndSelect("draft.intendedContentDraft", "intendedContentDraft")
            .leftJoinAndSelect("intendedContentDraft.content", "content2")
            .leftJoinAndSelect("content2.container", "container2")
            .leftJoinAndSelect("container2.space", "space2")

            .addSelect("draft.data")
            .where("draft.entityId = :entityId")
            .setParameter("entityId", args.materialDraftId)
            .getOne();

        if (draft.material.data == args.data) {
            return null;
        }

        // create commit
        let commit = MaterialCommit.create({
            editing: MaterialEditing.create({ id: draft.currentEditingId }),
            forkedCommit: draft.forkedCommit,
            data: args.data,
            committerUser: user
        });

        // update
        if (draft.material) {
            // check auth
            if (draft.material.space) {
                await auth.checkSpaceAuth(user, draft.material.space, SpaceAuth.WRITABLE);
            } else {
                await auth.checkSpaceAuth(user, draft.material.content.container.space, SpaceAuth.WRITABLE);
            }

            commit.material = draft.material;

            let _;
            [commit, _, _, _] = await Promise.all([
                commit.save(),
                MaterialDraft.update(draft, { data: null, currentEditing: null }),
                MaterialEditing.update(draft.currentEditingId, { state: EditingState.COMMITTED }),
                Material.update(draft.material, { data: args.data, updaterUser: user })
            ]);

            // create
        } else {
            let material = Material.create({
                displayName: draft.intendedDisplayName,
                materialType: draft.intendedMaterialType,
                data: args.data,
                creatorUser: user,
                updaterUser: user
            });
            material = await material.save();

            if (draft.intendedContentDraft) {
                await ContentDraft.update(draft.intendedContentDraft, { updatedAt: Date.now() });

                // check auth
                if (draft.intendedContentDraft.content) {
                    const space = draft.intendedContentDraft.content.container.space;
                    await auth.checkSpaceAuth(user, space, SpaceAuth.WRITABLE);

                    // update content
                    await Content.update(draft.intendedContentDraft.content, { updaterUser: user });
                } else {
                    throw "The parent content have not be committed"
                }

                material.content = draft.intendedContentDraft.content;

            } else if (draft.intendedSpace) {
                // check auth
                await auth.checkSpaceAuth(user, draft.intendedSpace, SpaceAuth.WRITABLE);

                material.space = draft.intendedSpace;
            } else {
                throw "Neither space nor content is specified";
            }

            commit.material = material;

            let _;
            [commit, _, _] = await Promise.all([
                commit.save(),
                MaterialDraft.update(draft, { data: null, currentEditing: null }),
                MaterialEditing.update(draft.currentEditingId, { state: EditingState.COMMITTED }),
            ]);
        }

        return toRelatedMaterialCommit(commit);
    }

    async getMaterial(materialId: MaterialId): Promise<FocusedMaterial> {

        const material = await this.mat.fromMaterials().byEntityId(materialId).selectFocused(null).getOne();
        const draft = this.edit.fromDrafts().byUser(null).byMaterial()

        // get user
        const user = await base.getMyUser();

        // get material
        const material = await Material
            .createQueryBuilder("material")
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .where("material.entityId = :entityId")
            .setParameter("entityId", args.materialId)
            .addSelect("material.data")
            .getOne();

        // get draft
        const draft = await MaterialDraft.findOne({ user, material });

        return toFocusedMaterial(material, draft);
    }

    async getMyMaterialDrafts(): Promise<RelatedMaterialDraft[]> {
        const user = await this.getMyUser();
        return await this.edit.fromDrafts().byUser(user).selectRelated().getMany();
    }

    async getMaterialDraft(draftId: MaterialDraftId): Promise<FocusedMaterialDraft> {
        const [draft, rawDraft] = await this.edit.fromDrafts().byEntityId(draftId).selectFocused().getOneWithRaw();
        if (rawDraft.userId != this.myUserId) {
            throw "This is not my draft";
        }
        return draft;
    }

    async getMaterialCommits(materialId: MaterialId): Promise<RelatedMaterialCommit[]> {
        const material = await this.mat.fromMaterials().byEntityId(materialId).getOne();
        const space = await this.spaces.fromSpaces().byId(material.spaceId).getOne();
        await this.spaces.fromAuths().checkSpaceAuth(this.myUserId, space, SpaceAuth.READABLE);
        return await this.mat.fromCommits().byMaterial(material.id).getMany();
    }

    async getMaterialEditingNodes(draftId: MaterialDraftId): Promise<MaterialNode[]> {
        const draft = await this.edit.fromDrafts().byEntityId(draftId).getOne();
        if (draft.userId != this.myUserId) {
            throw "";
        }
        const aaa: Promise<number> = Promise.resolve(4);
        return await this.rev.fromNodes().getManyByDraft(draft.id);
    }

    async getMaterialRevision(revisionId: MaterialRevisionId): Promise<FocusedMaterialSnapshot> {
        return await this.rev.fromRevisions().getFocusedOneById(revisionId);
    }

    async getMaterialCommit(commitId: MaterialCommitId): Promise<FocusedMaterialCommit> {
        return await this.mat.fromCommits().byEntityId(commitId).selectFocused().getOne();
    }
}