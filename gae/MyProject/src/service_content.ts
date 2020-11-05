import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { MongoClient } from './client_mongodb';
import { ChangeType, Container, Content, ContentCommit, ContentDraft, ContentEditing, ContentGenerator, ContentSnapshot, EditingState, Format, FormatUsage, Language, Material, MaterialDraft, MaterialEditing, MaterialSnapshot, MaterialType, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { toFocusedContent, toContentNodes, toFocusedContentCommit, ContentCommitId, toFocusedFormatFromStructure, toFocusedMaterial, toRelatedMaterial, RelatedMaterialSnapshot, toFocusedContentDraft, toRelatedContentDraft, RelatedContentDraft, RelatedContentSnapshot, toRelatedMaterialDraft, toRelatedContentCommit, toRelatedContentSnapshotFromSnapshot, SnapshotSource, toFocusedContentSnapshotFromSnapshot, toFocusedContentSnapshotFromCommit, toFocusedMaterialSnapshotFromDraft, toFocusedContentSnapshotFromDraft, FocusedContentSnapshot, ContentNode, RelatedContentCommit, FocusedContentDraft, FocusedContent, ContentId, SpaceId, ContentDraftId } from './utils_entities';
import { UtilsFormat } from './utils_format';

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

export async function _getOrCreateContainer(spaceId: number, formatId: number) {
    let container = await Container
        .createQueryBuilder("container")
        .where("container.spaceId = :spaceId")
        .where("container.formatId = :formatId")
        .setParameters({ spaceId: spaceId, formatId: formatId })
        .getOne();

    if (!container) {
        container = Container.create({
            space: Space.create({ id: spaceId }),
            format: Format.create({ id: formatId })
        })
        container = await container.save();
    }

    return container;
}

export async function _getFocusedFormatFromStructureId(structureId: number) {
    const format = await
        formatUtils.joinProperties(Structure
            .createQueryBuilder("structure")
            .leftJoinAndSelect("structure.format", "format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            , "structure")
            .where("structure.id = :structureId")
            .setParameters({ structureId })
            .getOne();
    return toFocusedFormatFromStructure(format);
}

export async function _getMaterialDrafts(user: User, content: Content, contentDraft: ContentDraft) {

    async function toDraft(material: Material) {
        if (material.drafts.length == 0) {
            let materialDraft = MaterialDraft.create({
                material,
                user
            });
            materialDraft = await materialDraft.save();
            materialDraft.material = material;
            materialDraft.data = material.data;
            return materialDraft;
        } else {
            const materialDraft = material.drafts[0];
            materialDraft.material = material;
            return materialDraft;
        }
    }

    async function getCreatedMaterialDrafts() {
        const materials = await Material.createQueryBuilder("material")
            .leftJoinAndSelect("material.drafts", "draft")
            .where("draft.user = :user")
            .where("material.content = :content")
            .setParameter("user", user)
            .setParameter("content", content)
            .addSelect("draft.data")
            .addSelect("material.data")
            .getMany();

        return await Promise.all(materials.map(toDraft));
    }

    async function getNotCreatedMaterialDrafts() {
        return await MaterialDraft.createQueryBuilder("draft")
            .where("intendedContentDraft = :contentDraft")
            .setParameter("contentDraft", contentDraft)
            .addSelect("draft.data")
            .getMany();
    }

    const [m1, m2] = await Promise.all([
        getCreatedMaterialDrafts(),
        getNotCreatedMaterialDrafts()
    ])

    return m1.concat(m2);
}

export async function startContentEditing(args: { contentId: ContentId, forkedCommitId: ContentCommitId | null }): Promise<RelatedContentDraft> {

    // get user
    const user = await base.getMyUser();

    // get content
    const content = await Content.findOne({ entityId: args.contentId });

    // get or create draft
    let draft = await ContentDraft.findOne({ content });
    if (!draft) {
        draft = ContentDraft.create({
            content,
            user
        });
        draft = await draft.save();
    }

    // validate forked commit
    let forkedCommit: ContentCommit | null = null;
    if (args.forkedCommitId) {
        forkedCommit = await ContentCommit.findOne({ entityId: args.forkedCommitId });
        if (forkedCommit) {
            if (forkedCommit.contentId != draft.content.id) {
                throw "The content of the specified forked commit is not the specified content"
            }
        }
    }

    // create editing
    if (!draft.currentEditing) {
        let editing = ContentEditing.create({
            draft,
            forkedCommit,
            user,
            state: EditingState.EDITING
        });
        editing = await editing.save();

        await ContentDraft.update(draft, { currentEditing: editing });
    }

    return toRelatedContentDraft(draft);
}

export async function startBlankContentEditing(args: { spaceId: SpaceId, displayName: string, type: MaterialType }): Promise<RelatedContentDraft> {

    // get user
    const user = await base.getMyUser();

    const space = await Space.findOne({ entityId: args.spaceId });

    // create draft
    let draft = ContentDraft.create({
        intendedSpace: space,
        user
    });
    draft = await draft.save();

    // create material
    let editing = ContentEditing.create({
        draft,
        user,
        state: EditingState.EDITING
    });
    editing = await editing.save();
    await ContentDraft.update(draft, { currentEditing: editing });

    return toRelatedContentDraft(draft);
}

export async function editContent(args: { contentDraftId: ContentDraftId, data: any }): Promise<RelatedContentSnapshot | null> {

    // get user
    const user = await base.getMyUser();

    // get draft
    const draft = await ContentDraft.findOne({ entityId: args.contentDraftId });

    if (!draft) {
        throw "The specified content draft does not exists";
    } else if (!draft.currentEditingId) {
        throw "The state of this content draft is not editing";
    }

    // upsert snapshot
    if (draft.data != args.data) {
        const changeType = this._getChangeType(draft.data.length, args.data.length);

        // create snapshot
        // 文字数が最大値として極値を取るとき、保存する
        if (draft.changeType != ChangeType.REMOVE && changeType == ChangeType.REMOVE) {
            let snapshot = ContentSnapshot.create({
                editing: ContentEditing.create({ id: draft.currentEditingId }),
                data: draft.data,
                timestamp: draft.updatedAt
            });

            await Promise.all([
                snapshot.save(),
                ContentDraft.update(draft, { data: args.data, changeType })
            ]);

            return toRelatedContentSnapshotFromSnapshot(snapshot, []);
            // update editing
        } else {
            await ContentDraft.update(draft, { data: args.data })
        }
    }

    return null;
}

export async function commitContent(args: { contentDraftId: ContentDraftId, data: any }): Promise<RelatedContentCommit | null> {

    // get user
    const user = await base.getMyUser();

    // get draft
    const draft = await ContentDraft
        .createQueryBuilder("editing")

        .leftJoinAndSelect("draft.material", "material")

        .leftJoinAndSelect("draft.content", "content")
        .leftJoinAndSelect("content1.container", "container1")
        .leftJoinAndSelect("container1.space", "space1")

        .leftJoinAndSelect("draft.intendedSpace", "intendedSpace")
        .leftJoinAndSelect("draft.structure", "structure")

        .addSelect("draft.data")
        .where("draft.entityId = :entityId")
        .setParameter("entityId", args.contentDraftId)
        .getOne();

    if (draft.content.data == args.data) {
        return null;
    }

    // create commit
    let commit = ContentCommit.create({
        editing: ContentEditing.create({ id: draft.currentEditingId }),
        forkedCommit: draft.forkedCommit,
        data: args.data,
        committerUser: user
    });

    // update
    if (draft.content) {
        // check auth
        await auth.checkSpaceAuth(user, draft.content.container.space, SpaceAuth.WRITABLE);

        commit.content = draft.content;

        let _;
        [commit, _, _, _] = await Promise.all([
            commit.save(),
            ContentDraft.update(draft, { data: null, currentEditing: null }),
            ContentEditing.update(draft.currentEditingId, { state: EditingState.COMMITTED }),
            Content.update(draft.content, { data: args.data, updaterUser: user })
        ]);

        // create
    } else {
        let content = Content.create({
            data: args.data,
            creatorUser: user,
            updaterUser: user
        });
        content = await content.save();

        if (draft.intendedSpace) {
            // check auth
            await auth.checkSpaceAuth(user, draft.intendedSpace, SpaceAuth.WRITABLE);

            content.container = await this._getOrCreateContainer(draft.intendedSpace.id, draft.structure.formatId);
        } else {
            throw "Neither space nor content is specified";
        }

        commit.content = content;

        let _;
        [commit, _, _] = await Promise.all([
            commit.save(),
            MaterialDraft.update(draft, { data: null, currentEditing: null }),
            MaterialEditing.update(draft.currentEditingId, { state: EditingState.COMMITTED }),
        ]);
    }

    return toRelatedContentCommit(commit);
}

export async function getContent(args: { contentId: ContentId }): Promise<FocusedContent> {

    // get user
    const user = await base.getMyUser();

    // get content
    const content = await Content
        .createQueryBuilder("content")
        .leftJoinAndSelect("creatorUser", "creatorUser")
        .leftJoinAndSelect("updaterUser", "updaterUser")
        .where("content.entityId = :entityId")
        .setParameter("entityId", args.contentId)
        .addSelect("content.data")
        .getOne();

    // get draft
    const draft = await ContentDraft.findOne({ user, content });

    // get format
    const format = await this._getFocusedFormatFromStructureId(content.structureId);

    return toFocusedContent(content, draft, format);
}

export async function getContentDrafts(): Promise<RelatedContentDraft[]> {

    // get user
    const user = await base.getMyUser();

    // get editings
    const drafts = await ContentDraft
        .createQueryBuilder("draft")
        .where("draft.user = :user")
        .setParameter("user", user)
        .getMany();

    return drafts.map(toRelatedContentDraft);
}

export async function getContentDraft(args: { draftId: ContentDraftId }): Promise<FocusedContentDraft> {

    // get user
    const user = await base.getMyUser();

    // get draft
    const draft = await ContentDraft
        .createQueryBuilder("draft")
        .leftJoinAndSelect("draft.content", "content")
        .where("draft.entityId = :draftId")
        .setParameter("draftId", args.draftId)
        .getOne();

    const materialDrafts = await this._getMaterialDrafts(user, draft.content, draft);

    return toFocusedContentDraft(draft, materialDrafts);
}

export async function getContentCommits(args: { contentId: ContentId }): Promise<RelatedContentCommit[]> {

    // get user
    const user = await base.getMyUser();

    // get editings
    const commits = await ContentCommit
        .createQueryBuilder("commit")
        .leftJoinAndSelect("commit.material", "material")
        .leftJoinAndSelect("commit.forkedCommit", "forkedCommit")
        .leftJoinAndSelect("commit.committerUser", "committerUser")
        .where("content.entityId = :contentId")
        .setParameter("contentId", args.contentId)
        .getMany();

    return commits.map(toRelatedContentCommit);
}

// include snapshot
export async function getContentEditingNodes(args: { draftId: ContentDraftId }): Promise<ContentNode[]> {

    // get user
    const user = await base.getMyUser();

    // get editing
    const draft = await ContentDraft.findOne({ entityId: args.draftId });
    const [editing, commit] = await Promise.all([
        ContentEditing.find({ draft }),
        ContentCommit.find({ content: Content.create({ id: draft.contentId }) })
    ]);

    return toContentNodes(editing, commit, [], []);
}

export async function getContentSnapshot(args: { source: SnapshotSource, entityId: string }): Promise<FocusedContentSnapshot> {

    switch(args.source) {
        case SnapshotSource.SNAPSHOT:
            const snapshot = await ContentSnapshot.findOne({ entityId: args.entityId }, { select: ["data"] });
            return toFocusedContentSnapshotFromSnapshot(snapshot, []);
        case SnapshotSource.COMMIT:
            const commit = await ContentCommit.findOne({ entityId: args.entityId }, { select: ["data"] });
            return toFocusedContentSnapshotFromCommit(commit, []);
        case SnapshotSource.DRAFT:
            const draft = await ContentDraft.findOne({ entityId: args.entityId }, { select: ["data"] });
            return toFocusedContentSnapshotFromDraft(draft, []);
    }
}

export async function getContentCommit(args: { commitId: ContentCommitId }): Promise<FocusedContentSnapshot> {

    const commit = await ContentCommit.findOne({ entityId: args.commitId }, { select: ["data"] });
    return toFocusedContentSnapshotFromCommit(commit, []);
}