import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { MongoClient } from './client_mongodb';
import { ChangeType, Content, ContentDraft, EditingState, Format, FormatUsage, Language, Material, MaterialCommit, MaterialDraft, MaterialEditing, MaterialSnapshot, MaterialType, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { toFocusedContent, toFocusedFormatFromStructure, toFocusedMaterialCommit, toFocusedMaterial, toRelatedMaterial, toFocusedMaterialSnapshotFromCommit, RelatedMaterialSnapshot, toRelatedMaterialCommit, toFocusedMaterialDraft, toRelatedMaterialDraft, RelatedMaterialDraft, RelatedMaterialCommit, toRelatedMaterialSnapshotFromSnapshot, toFocusedMaterialSnapshotFromSnapshot, FocusedMaterialSnapshot, FocusedMaterialCommit, MaterialNode, toMaterialNodes, SnapshotSource, toFocusedContentSnapshotFromDraft, toFocusedMaterialSnapshotFromDraft, FocusedMaterialDraft, FocusedMaterial, MaterialId, SpaceId, MaterialDraftId, MaterialCommitId } from './utils_entities';
import { UtilsFormat } from './utils_format';
import { timeStamp } from 'console';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;
const formatUtils = UtilsFormat;

function _getChangeType(prevLength: number, length: number) {
    // 文字数で変更の種類を分類
    if (prevLength <= length) {
        return ChangeType.WRITE;
    } else if (prevLength > length) {
        return ChangeType.REMOVE;
    }
}

export async function startMaterialEditing(args: { materialId: MaterialId, forkedCommitId: MaterialCommitId | null }): Promise<RelatedMaterialDraft> {

    // get user
    const user = await base.getMyUser();

    // get material
    const material = await Material.findOne({ entityId: args.materialId });

    // get or create draft
    let draft = await MaterialDraft.findOne({ material });
    if (!draft) {
        draft = MaterialDraft.create({
            material,
            user
        });
        draft = await draft.save();
    }

    // validate forked commit
    let forkedCommit: MaterialCommit | null = null;
    if (args.forkedCommitId) {
        forkedCommit = await MaterialCommit.findOne({ entityId: args.forkedCommitId });
        if (forkedCommit) {
            if (forkedCommit.materialId != draft.material.id) {
                throw "The material of the specified forked commit is not the specified material"
            }
        }
    }

    // create editing
    if (!draft.currentEditing) {
        let editing = MaterialEditing.create({
            draft,
            forkedCommit,
            user,
            state: EditingState.EDITING
        });
        editing = await editing.save();

        await MaterialDraft.update(draft, { currentEditing: editing });
    }

    return toRelatedMaterialDraft(draft);
}

export async function startBlankMaterialEditing(args: { spaceId: SpaceId, displayName: string, type: MaterialType }): Promise<RelatedMaterialDraft> {

    // get user
    const user = await base.getMyUser();

    // create draft
    let draft = MaterialDraft.create({
        intendedMaterialType: args.type,
        intendedDisplayName: args.displayName.split(" ").filter(x => x != "").join(" "),
        intendedSpace: await Space.findOne({ entityId: args.spaceId }),
        user
    });
    draft = await draft.save();

    // create material
    let editing = MaterialEditing.create({
        draft,
        user,
        state: EditingState.EDITING
    });
    editing = await editing.save();
    await MaterialDraft.update(draft, { currentEditing: editing });

    return toRelatedMaterialDraft(draft);
}

export async function editMaterial(args: { materialDraftId: MaterialDraftId, data: string }): Promise<RelatedMaterialSnapshot | null> {

    // get user
    const user = await base.getMyUser();

    // get draft
    const draft = await MaterialDraft.findOne({ entityId: args.materialDraftId });

    if (!draft) {
        throw "The specified material draft does not exists";
    } else if (!draft.currentEditingId) {
        throw "The state of this material draft is not editing";
    }

    // update content draft
    if (draft.intendedContentDraftId) {
        await ContentDraft.update(draft.intendedContentDraftId, { updatedAt: Date.now() });
    }

    // upsert snapshot
    if (draft.data != args.data) {
        const changeType = this._getChangeType(draft.data.length, args.data.length);

        // create snapshot
        // 文字数が最大値として極値を取るとき、保存する
        if (draft.changeType != ChangeType.REMOVE && changeType == ChangeType.REMOVE) {
            let snapshot = MaterialSnapshot.create({
                editing: MaterialEditing.create({ id: draft.currentEditingId }),
                data: draft.data,
                timestamp: draft.updatedAt
            });

            await Promise.all([
                snapshot.save(),
                MaterialDraft.update(draft, { data: args.data, changeType })
            ]);

            return toRelatedMaterialSnapshotFromSnapshot(snapshot);
            // update editing
        } else {
            await MaterialDraft.update(draft, { data: args.data })
        }
    }

    return null;
}

export async function commitMaterial(args: { materialDraftId: MaterialDraftId, data: string }): Promise<RelatedMaterialCommit | null> {

    // get user
    const user = await base.getMyUser();

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

export async function getMaterial(args: { materialId: MaterialId }): Promise<FocusedMaterial> {

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

export async function getMaterialDrafts(): Promise<RelatedMaterialDraft[]> {

    // get user
    const user = await base.getMyUser();

    // get editings
    const drafts = await MaterialDraft
        .createQueryBuilder("draft")
        .where("draft.user = :user")
        .setParameter("user", user)
        .getMany();

    return drafts.map(toRelatedMaterialDraft);
}

export async function getMaterialDraft(args: { draftId: MaterialDraftId }): Promise<FocusedMaterialDraft> {

    // get user
    const user = await base.getMyUser();

    // get draft
    const draft = await MaterialDraft
        .createQueryBuilder("draft")
        .leftJoinAndSelect("draft.material", "material")
        .leftJoinAndSelect("draft.intendedContentDraft", "intendedContentDraft")
        .where("draft.entityId = :draftId")
        .setParameter("draftId", args.draftId)
        .getOne();

    return toFocusedMaterialDraft(draft);
}

export async function getMaterialCommits(args: { materialId: MaterialId }): Promise<RelatedMaterialCommit[]> {

    // get user
    const user = await base.getMyUser();

    // get editings
    const commits = await MaterialCommit
        .createQueryBuilder("commit")
        .leftJoinAndSelect("commit.material", "material")
        .leftJoinAndSelect("commit.forkedCommit", "forkedCommit")
        .leftJoinAndSelect("commit.committerUser", "committerUser")
        .where("material.entityId = :materialId")
        .setParameter("materialId", args.materialId)
        .getMany();

    return commits.map(toRelatedMaterialCommit)
}

// include snapshot
export async function getMaterialEditingNodes(args: { draftId: MaterialDraftId }): Promise<MaterialNode[]> {

    // get user
    const user = await base.getMyUser();

    // get draft
    const draft = await MaterialDraft.findOne({ entityId: args.draftId });
    const [editing, commit] = await Promise.all([
        MaterialEditing.find({ draft }),
        MaterialCommit.find({ material: Material.create({ id: draft.materialId }) })
    ]);

    return toMaterialNodes(editing, commit);
}

export async function getMaterialSnapshot(args: { source: SnapshotSource, entityId: string }): Promise<FocusedMaterialSnapshot> {

    switch(args.source) {
        case SnapshotSource.SNAPSHOT:
            const snapshot = await MaterialSnapshot.findOne({ entityId: args.entityId }, { select: ["data"] });
            return toFocusedMaterialSnapshotFromSnapshot(snapshot);
        case SnapshotSource.COMMIT:
            const commit = await MaterialCommit.findOne({ entityId: args.entityId }, { select: ["data"] });
            return toFocusedMaterialSnapshotFromCommit(commit);
        case SnapshotSource.DRAFT:
            const draft = await MaterialDraft.findOne({ entityId: args.entityId }, { select: ["data"] });
            return toFocusedMaterialSnapshotFromDraft(draft);
    }
}

export async function getMaterialCommit(args: { commitId: MaterialCommitId }): Promise<FocusedMaterialCommit> {

    const commit = await MaterialCommit.findOne({ entityId: args.commitId }, { select: ["data"] });
    return toFocusedMaterialCommit(commit);
}