import * as firebase_functions from 'firebase-functions';
import { stringify } from 'querystring';
import * as crypto from 'crypto';
import { PubSub } from '@google-cloud/pubsub';

import * as DB from '../src/client_sql';
import axios from 'axios';

import * as Ajv from 'ajv';

const functions = firebase_functions.region("asia-northeast1");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

import { PS } from '../purescript-index.js';


const ref = new DB.Reference();


const pubsub = new PubSub({ projectId: "incentknow" });
const crawlingTopic = pubsub.topic("projects/incentknow/topics/crawling");

function timestamp() {
    const date = new Date();
    const milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}

function timestampMilliseconds() {
    const date = new Date();
    return date.getTime();
}

function genId() {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 12;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('');
}

function genRandom1000() {
    const S = "0123456789";
    const N = 4;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('');
}

function genTimeId() {
    return timestampMilliseconds().toString() + genRandom1000().toString();
}

class BadRequest {
    constructor(public error: string) {
    }
}

class NotExists extends BadRequest {
    constructor(type: "content" | "format" | "user" | "crawler" | "reactor" | "container" | "structure") {
        super("この" + type +"は存在しません");
    }
}

class BatchUsersError {
    constructor(public error: string) {
    }
}

function onCall<T>(handler: (data: T, context: firebase_functions.https.CallableContext) => Promise<any>) {
    async function handler2(data: any, context: firebase_functions.https.CallableContext) {
        try {
            return handler(data, context);
        } catch (e) {
            if (e instanceof BadRequest) {
                return { error: e.error };
            } else {
                throw e;
            }
        }
    }
    return functions.https.onCall(handler2);
}

function toMap<T, TValue>(array: T[], getKey: (x: T) => string, getValue: (x: T) => TValue) {
    return array.reduce((m: { [key: string]: TValue }, x) => {
        m[getKey(x)] = getValue(x);
        return m;
    }, {})
}

function isLogined<T>(auth: { uid: string, token: T } | undefined): auth is { uid: string, token: T } {
    if (!auth) {
        throw new BadRequest("ログインしてください");
    }
    return true;
}

function createSnapshot(
    batch: DB.Batch,
    workRef: DB.WorkReference,
    workingChangeId: string | null,
    snapshot: DB.Snapshot) {
    // changeを作成もしくは更新
    let changeRef;
    let changeId;
    const time = timestamp();
    if (!workingChangeId) {
        changeId = genId();
        changeRef = workRef.changes.doc(changeId);
        const change = {
            createdAt: time,
            updatedAt: time
        };
        batch.create(changeRef, change);
    } else {
        changeId = workingChangeId;
        changeRef = workRef.changes.doc(changeId);
        const change = {
            updatedAt: time
        };
        batch.update(changeRef, change);
    }

    // snapshotを作成
    const snapshotId = genTimeId();
    const snapshotRef = changeRef.snapshots.doc(snapshotId);
    batch.create(snapshotRef, snapshot);
    return changeId;
}

function mkNewWork(spec: BlankWork | ContentWork, formatId: string, structureId: string, data: any) {
    const time = timestamp();
    const work: DB.Work = {
        createdAt: time,
        updatedAt: time,
        formatId: formatId,
        structureId: structureId,
        data: data,
        change: "initial",
        state: "working",
        workingChangeId: null,
        contentId: spec.workType == "content" ? spec.contentId : null,
        spaceId: spec.workType == "blank" ? spec.spaceId : null,
    };
    return work;
}

async function _createSpace(batch: DB.Batch, data: any, userId: string) {
    if (!(await _checkSpaceDisplayId(data.displayId))) {
        return { error: "このIDは既に存在します" };
    }

    const spaceId = genId();
    const time = timestamp();

    const space: DB.Space = {
        displayName: data.displayName,
        displayId: data.displayId,
        description: data.description,
        formatCount: 0,
        memberCount: 1, // owner
        committerCount: 0, // owner
        creatorUserId: userId,
        createdAt: time,
        homeUrl: null,
        published: false,
        authority: { base: "none" },
        membershipMethod: "none"
    };

    const member: DB.SpaceMember = {
        joinedAt: time,
        appliedAt: null,
        type: "owner"
    };

    const userSpace: DB.UserSpace = {
        type: "membership",
        createdAt: time
    };

    const spaceRef = ref.spaces.doc(spaceId);
    const memberRef = spaceRef.members.doc(userId);
    const userSpaceRef = ref.users.doc(userId).followingSpaces.doc(spaceId);

    batch.create(memberRef, member);
    batch.create(spaceRef, space);
    batch.create(userSpaceRef, userSpace);

    return spaceId;
}

// blank work: contentId=null
// content work: spaceId=null

// spaceId もしnull以外が指定されていたらそれをworkに設定する

interface BlankWork {
    workType: "blank";
    spaceId: string;
}

interface ContentWork {
    workType: "content";
    contentId: string;
}

function getChangeType(prevLength: number, length: number) {
    // 文字数で変更の種類を分類
    if (prevLength < length) {
        return "increase";
    } else if (prevLength > length) {
        return "decrease";
    } else {
        return "complex"; 
    }
}

interface WorkUpdation {
    spec: BlankWork | ContentWork;
    userId: string;
    workId: string;
    formatId: string;
    structureId: string;
    data: any;
}

async function writeWork(args: WorkUpdation) {
    const workRef = ref.users.doc(args.userId).works.doc(args.workId);
    const batch = new DB.Batch();
    const time = timestamp();
    const prevWork = (await workRef.get()).data();
    if (!prevWork) {
        if (args.spec.workType == "content") {
            const work = mkNewWork(args.spec, args.formatId, args.structureId, args.data);
            batch.create(workRef, work);
        } else {
            return { error: "このWorkIdは存在しません" };
        }
    } else {
        const prevText = stringify(prevWork.data as any);
        const text = stringify(args.data);
        if (prevText != text) {
            const work: Partial<DB.Work> = {
                updatedAt: time,
                data: args.data,
                change: getChangeType(prevText.length, text.length),
                state: "working",
                contentId: args.spec.workType == "content" ? args.spec.contentId : null,
                spaceId: args.spec.workType == "blank" ? args.spec.spaceId : null,
                formatId: args.formatId
            };

            if (prevWork.change != "decrease" && work.change == "decrease") {
                // snapshotを作成
                const snapshot = {
                    data: prevWork.data,
                    timestamp: prevWork.updatedAt,
                    formatId: prevWork.formatId,
                    structureId: prevWork.structureId
                };
                const changeId = createSnapshot(batch, workRef, prevWork.workingChangeId, snapshot);

                // workを更新
                work.workingChangeId = changeId;
                batch.update(workRef, work);
            } else {
                // workを更新
                batch.update(workRef, work);
            }
        }
    }
    await batch.commit();
    return {};
}

async function snapshotLatestWork(batch: DB.Batch, userId: string, contentId: string) {
    const workRef = ref.users.doc(userId).works.doc(contentId);
    const workSnap = await workRef.get();
    const work = workSnap.data();
    if (!work) {
        throw null;
    }
    const snapshot = {
        data: work.data,
        timestamp: work.updatedAt,
        structureId: work.structureId
    };
    const diffWork: Partial<DB.Work> = {
        state: "committed",
        workingChangeId: null,
        contentId: contentId
    };
    batch.update(workRef, diffWork);
    return createSnapshot(batch, workRef, work.workingChangeId, snapshot);
}

export const createUser = onCall<{
    email: string,
    password: string,
    displayName: string
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const userId = genId();
    let user;
    try {
        user = await DB.auth.createUser({ uid: userId, email: data.email, password: data.password, displayName: data.displayName });
    } catch (error) {
        return { error: error };
    }
    const batch = new DB.Batch();
    const spaceData = {
        displayName: data.displayName + "の個人用スペース",
        displayId: genId(),
        description: "ユーザー登録時に自動で作成された個人用のスペースです"
    };
    const spaceId = await _createSpace(batch, spaceData, context.auth.uid);
    const publicUser = {
        displayName: data.displayName,
        displayId: userId,
        iconUrl: null
    };
    const privateUser = {
        defaultSpaceId: spaceId
    };
    batch.create(ref.users.doc(user.uid), publicUser);
    batch.create(ref.userSettings.doc(user.uid), privateUser);
    await batch.commit();
    return user.uid;
});

async function _checkSpaceDisplayId(displayId: string) {
    const snaps = await ref.spaces.where("displayId", "==", displayId).get();
    return snaps.empty;
}

export const checkSpaceDisplayId = onCall<string>(async (data, context) => {
    return await _checkSpaceDisplayId(data);
});

export const createSpace = onCall(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const batch = new DB.Batch();
    const spaceId = await _createSpace(batch, data, context.auth.uid);
    await batch.commit();
    return spaceId;
});

export const createFormat = onCall<{
    spaceId: string,
    displayId: string,
    displayName: string,
    description: string,
    usage: string,
    structure: DB.Property[]
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const formats = (await ref.formats.where("spaceId", "==", data.spaceId).get()).docs;
    if (formats.filter(snap => snap.data().displayId == data.displayId).length > 0) {
        return { error: "このIDのフォーマットは既にこのスペースに存在します" };
    }

    const formatId = genId();
    const time = timestamp();
    const format: DB.Format = {
        spaceId: data.spaceId,
        displayName: data.displayName,
        displayId: data.displayId,
        description: data.description,
        defaultStructureId: "1",
        creatorUserId: context.auth.uid,
        createdAt: time,
        updaterUserId: context.auth.uid,
        updatedAt: time,
        semanticId: null,
        usage: data.usage,
        generator: "none",
        relations: PS.getStructureRelations(data.structure),
        contentPage: { relations: [] },
        collectionPage: { compositions: [] }
    };
    const properties = PS.normalizeStructure(data.structure);
    const structure = {
        properties: properties
    };
    const batch = new DB.Batch();
    batch.create(ref.formats.doc(formatId), format);
    batch.create(ref.formats.doc(formatId).structures.doc("1"), structure);
    batch.update(ref.spaces.doc(data.spaceId), { formatCount: DB.increment(1) });
    await batch.commit();

    return formatId;
});

async function initCommitter(batch: DB.Batch, spaceRef: DB.SpaceReference, committerRef: DB.DocumentReference<DB.SpaceCommitter>) {
    const committerSnap = await committerRef.get()
    if (!committerSnap.exists) {
        const time = timestamp();
        batch.create(committerRef, { firstCommittedAt: time, lastCommittedAt: time, contentCount: 0, commitCount: 0 });
        batch.update(spaceRef, { committerCount: DB.increment(1) });
    }
}

async function getContainerId(spaceId: string, formatId: string) {
    const containersSnap = await ref.containers.where("spaceId", "==", spaceId).where("formatId", "==", formatId).get();
    if (containersSnap.empty) {
        const containerId = genId();
        await ref.containers.doc(containerId).create({ spaceId, formatId, itemCount: 0 });
        return containerId;
    } else {
        return containersSnap.docs[0].ref.id;
    }
};

export const createContent = onCall<{
    workId: string,
    formatId: string,
    spaceId: string
    data: any
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    let contentId;
    if (data.workId) {
        contentId = data.workId;
    } else {
        contentId = genId();
    }

    const format = (await ref.formats.doc(data.formatId).get()).data();
    if (!format) {
        return { error: "このフォーマットは存在しません" };
    }
    const structure =  (await ref.formats.doc(data.formatId).structures.doc(format.defaultStructureId).get()).data();
    if (!structure) {
        throw new NotExists("structure");
    }

    const time = timestamp();
    const batch = new DB.Batch();

    // workに書き込み userId, workId, contentId, spaceId, data
    await writeWork({
        spec: { workType: "content", contentId }, 
        userId: context.auth.uid, 
        workId: contentId, 
        formatId: data.formatId, 
        structureId: format.defaultStructureId, 
        data: data.data
    });
    const commitId = await snapshotLatestWork(batch, context.auth.uid, contentId);

    const content: DB.Content = {
        data: data.data,
        indexes: PS.getContentIndexes({props: structure.properties, data: data.data }),
        structureId: format.defaultStructureId,
        creatorUserId: context.auth.uid,
        createdAt: time,
        updaterUserId: context.auth.uid,
        updatedAt: time,
        viewCount: 0,
        updateCount: 1,
        version: 1
    };
    const activity: DB.SpaceActivity = {
        userId: context.auth.uid,
        timestamp: time,
        contentId: contentId,
        formatId: data.formatId,
        type: "creation",
        target: "content"
    };
    const commit: DB.Commit = {
        data: data.data,
        userId: context.auth.uid,
        timestamp: time,
        structureId: format.defaultStructureId,
        version: 1
    }

    const containerId = await getContainerId(data.spaceId, data.formatId);

    // count
    const spaceRef = ref.spaces.doc(data.spaceId);
    const containerRef = ref.containers.doc(containerId);
    const contentRef = containerRef.items.doc(contentId);
    const junctionRef = ref.contents.doc(contentId);
    const committerRef = spaceRef.committers.doc(context.auth.uid);
    const activityRef = spaceRef.activities.doc(genTimeId());
    const commitRef = junctionRef.commits.doc(commitId);

    await initCommitter(batch, spaceRef, committerRef);

    batch.create(commitRef, commit);
    batch.create(contentRef, content);
    batch.create(junctionRef, { containerId, formatId: data.formatId, structureId: format.defaultStructureId });
    batch.create(activityRef, activity);
    batch.update(containerRef, { itemCount: DB.increment(1) });
    batch.update(committerRef, { lastCommittedAt: time, contentCount: DB.increment(1), commitCount: DB.increment(1) });
    await batch.commit();

    return contentId;
});

export const commitContent = onCall<{
    contentId: string,
    structureId: string,
    data: any
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    // ジャンクションとフォーマットを取得
    const junctionRef = ref.contents.doc(data.contentId);
    const junction = (await junctionRef.get()).data();
    if (!junction) {
        return { error: "このコンテンツは存在しません" };
    }
    const container = (await ref.containers.doc(junction.containerId).get()).data();
    if (!container) {
        return { error: "このコンテナは存在しません" };
    }
    const format = (await ref.formats.doc(container.formatId).get()).data();
    if (!format) {
        return null;
    }
    const structure = (await ref.formats.doc(container.formatId).structures.doc(data.structureId).get()).data();
    if (!structure) {
        throw new NotExists("structure");
    }

    await writeWork({
        spec: {
            workType: "content",
            contentId: data.contentId
        },
        userId: context.auth.uid,
        workId: data.contentId,
        formatId: container.formatId,
        structureId: data.structureId,
        data: data.data
    });

    const batch = new DB.Batch();
    const time = timestamp();

    const commitId = await snapshotLatestWork(batch, context.auth.uid, data.contentId);

    const diffContent = {
        data: data.data,
        indexes: PS.getContentIndexes({ props: structure.properties, data: data.data }),
        structureId: format.defaultStructureId,
        updaterUserId: context.auth.uid,
        updatedAt: time,
        updateCount: DB.increment(1),
        version: DB.increment(1)
    };

    const spaceRef = ref.spaces.doc(container.spaceId);
    const contentRef = ref.containers.doc(junction.containerId).items.doc(data.contentId);
    const activityRef = spaceRef.activities.doc(genTimeId());
    const committerRef = spaceRef.committers.doc(context.auth.uid);

    const prevContent = (await contentRef.get()).data();
    if (!prevContent) {
        throw null;
    }

    const activity = {
        userId: context.auth.uid,
        timestamp: time,
        contentId: data.contentId,
        formatId: container.formatId,
        version: prevContent.version as number + 1,
        type: "updation",
        target: "content"
    };

    const commit = {
        data: data.data,
        userId: context.auth.uid,
        timestamp: time,
        structureId: format.defaultStructureId,
        version: prevContent.version as number + 1
    };

    await initCommitter(batch, spaceRef, committerRef);
    if (junction.structureId != data.structureId) {
        batch.update(junctionRef, { structureId: data.structureId });
    }
    batch.update(contentRef, diffContent);
    batch.create(activityRef, activity);
    batch.create(junctionRef.commits.doc(commitId), commit);
    batch.update(committerRef, { commitCount: DB.increment(1) });
    await batch.commit();

    return {};
});
// firebase.auth().signInWithEmailAndPassword(email, password)

// firebase experimental:functions:shell

export const writeContentWork = onCall<{
    contentId: string,
    structureId: string,
    data: any
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const junction = (await ref.contents.doc(data.contentId).get()).data();
    if (!junction) {
        throw new NotExists("content");
    }
    const container = (await ref.containers.doc(junction.containerId).get()).data();
    if (!container) {
        throw new NotExists("container");
    }
    const content = (await ref.containers.doc(junction.containerId).items.doc(data.contentId).get()).data();
    if (!content) {
        throw new NotExists("content");
    }

    return await writeWork({
        spec: {
            workType: "content",
            contentId: data.contentId
        },
        userId: context.auth.uid, 
        workId: data.contentId,
        formatId: container.formatId,
        structureId: data.structureId,
        data: data.data
    });
});

export const updateBlankWork = onCall<{
    workId: string,
    spaceId: string,
    formatId: string,
    structureId: string,
    data: any
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    return await writeWork({
        spec: {
            workType: "blank",
            spaceId: data.spaceId
        },
        userId: context.auth.uid,
        workId: data.workId, 
        formatId: data.formatId, 
        structureId: data.structureId,
        data: data.data
    });
});

export const createBlankWork = onCall<{
    formatId: string,
    spaceId: string,
    data: any
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const workId = genId();
    const workRef = ref.users.doc(context.auth.uid).works.doc(workId);
    const format = (await ref.formats.doc(data.formatId).get()).data();
    if (!format) {
        return { error: "このフォーマットは定義されていません" };
    }
    const work = mkNewWork({ workType: "blank", spaceId: data.spaceId }, data.formatId, format.defaultStructureId, data.data);
    await workRef.create(work);
    return workId;
});

export const deleteWork = onCall<string>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const workRef = ref.users.doc(context.auth.uid).works.doc(data);
    await workRef.update({ state: "deleted" });
    return {};
});

export const setMyDisplayName = onCall<string>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const userRef = ref.users.doc(context.auth.uid);
    await userRef.update({ displayName: data });
    return {};
});

export const setMyIcon = onCall(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const userRef = ref.users.doc(context.auth.uid);
    await userRef.update({ iconUrl: timestamp().toString() });
    return {};
});

export const setSpaceDisplayName = onCall<{
    spaceId: string,
    displayName: string
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    if (typeof data.displayName != "string") {
        return { error: "入力エラー" };
    }
    await spaceRef.update({ displayName: data.displayName });
    return {};
});

export const setSpaceHomeImage = onCall<{
    spaceId: string
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    await spaceRef.update({ homeUrl: timestamp().toString() });
    return {};
});

export const setSpacePublished = onCall<{
    spaceId: string,
    published: boolean
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    if (typeof data.published != "boolean") {
        return { error: "入力エラー" };
    }
    if (data.published) {
        const space = (await spaceRef.get()).data();
        if (!space) {
            return { error: "このスペースは存在しません" };
        }
        if (space.authority.base == "none") {
            return { error: "標準権限がVisible以上に設定されていないとPublishedを有効にすることはできません" };
        }
    }
    await spaceRef.update({ published: data.published });
    return {};
});

export const setSpaceAuthority = onCall<{
    spaceId: string,
    authority: any
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    await spaceRef.update({ authority: data.authority });
    return {};
});

export const setSpaceDisplayId = onCall<{
    spaceId: string,
    displayId: string
}>(async (data, context) => {
    if (!(await _checkSpaceDisplayId(data.displayId))) {
        return { error: "このIDは既に存在します" };
    }
    const spaceRef = ref.spaces.doc(data.spaceId);
    await spaceRef.update({ displayId: data.displayId });
    return {};
});

export const setFormatContentPage = onCall<{
    formatId: string,
    contentPage: DB.ContentPage
}>(async (data, context) => {
    const formatRef = ref.formats.doc(data.formatId);
    await formatRef.update({ contentPage: data.contentPage });
    return {};
});

export const setFormatCollectionPage = onCall<{
    formatId: string,
    collectionPage: DB.CollectionPage
}>(async (data, context) => {
    const formatRef = ref.formats.doc(data.formatId);
    await formatRef.update({ collectionPage: data.collectionPage });
    return {};
});

export const applySpaceMembership = onCall<{
    spaceId: string
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const memberRef = ref.spaces.doc(data.spaceId).members.doc(context.auth.uid);
    await memberRef.create({ type: "pending", appliedAt: timestamp(), joinedAt: null });
    return {};
});

export const acceptSpaceMembership = onCall<{
    spaceId: string
    userId: string
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    const memberRef = spaceRef.members.doc(data.userId);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) {
        return { error: "このユーザーは申請していません" };
    }
    const member = memberSnap.data();
    if (!member) {
        return { error: "このメンバーは存在しません" };
    }
    if (member.type != "pending") {
        return { error: "既にメンバーです" };
    }
    const batch = new DB.Batch();
    batch.update(memberRef, { type: "normal", appliedAt: null, joinedAt: timestamp() });
    batch.update(spaceRef, { memberCount: DB.increment(1) });
    await batch.commit();
    return {}
});

export const rejectSpaceMembership = onCall<{
    spaceId: string,
    userId: string
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    const memberRef = spaceRef.members.doc(data.userId);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) {
        return { error: "このユーザーは申請していません" };
    }
    const member = memberSnap.data();
    if (!member) {
        return { error: "このメンバーは存在しません" };
    }
    if (member.type != "pending") {
        return { error: "既にメンバーです" };
    }
    const batch = new DB.Batch();
    batch.delete(memberRef);
    await batch.commit();
    return {}
});

export const cancelSpaceMembershipApplication = onCall<{
    spaceId: string
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const memberRef = ref.spaces.doc(data.spaceId).members.doc(context.auth.uid);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) {
        return { error: "申請していません" };
    }
    const member = memberSnap.data();
    if (!member) {
        return { error: "このメンバーは存在しません" };
    }
    if (member.type != "pending") {
        return { error: "既にメンバーです" };
    }
    await memberRef.delete();
    return {}
});

export const setSpaceMembershipMethod = onCall<{
    spaceId: string,
    membershipMethod: string
}>(async (data, context) => {
    const spaceRef = ref.spaces.doc(data.spaceId);
    await spaceRef.update({ membershipMethod: data.membershipMethod });
    return {};
});

/*
    generatorプロパティはnone, reactor, transformer, crawlerのどれかが指定できる
    Content generator(Reactor, Transformer, Crawler)(以後CG)は、種類にごとにFormatに1つまで作成できる
    一度作成された物が削除されることはない
*/
export const setContentGenerator = onCall<{
    formatId: string,
    generator: string
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const formatRef = ref.formats.doc(data.formatId);
    const format = (await formatRef.get()).data();
    if (!format) {
        return { error: "このフォーマットは存在しません" };
    }
    if (format.usage != "internal") {
        return { error: "Content generatorはInternal formatにしか作成できません" }
    }
    const spaceRef = ref.spaces.doc(format.spaceId);
    const space = (await spaceRef.get()).data();
    const time = timestamp();
    const batch = new DB.Batch();

    if (data.generator == "reactor") {
        const reactorRef = ref.reactors.doc(data.formatId);
        const reactorSnap = await reactorRef.get();
        if (!reactorSnap.exists) {
            const reactor: Partial<DB.Reactor> = {
                spaceId: format.spaceId,
                definitionId: null,
                creatorUserId: context.auth.uid,
                createdAt: time,
                state: "invaild"
            };
            batch.create(reactorRef, reactor);
        }
    } else if (data.generator == "none") {
        if (format.generator == "reactor") {
            const reactorRef = ref.reactors.doc(data.formatId);
            batch.update(reactorRef, { state: "disused" });
        }
    } else {
        return { error: "'" + data.generator + "'はContent generatorに指定できません" };
    }

    batch.update(formatRef, { generator: data.generator });
    await batch.commit();
    return {};
});

export const setReactorDefinitionId = onCall<{
    formatId: string,
    definitionId: string
}>(async (data, context) => {
    const reactorRef = ref.reactors.doc(data.formatId);
    await reactorRef.update({ definitionId: data.definitionId });
    return {};
});

function getContentObject(content: DB.Data, structure: DB.Structure) {
    function mkValue(value: any, type: DB.Type): any {
        if (value === undefined || value === null) {
            return null;
        } else if (type.name == "object") {
            return mkObject(value, type.arguments.properties);
        } else if (type.name == "array") {
            return value.map((item: any) => mkValue(item, type.arguments.type));
        } else {
            return value;
        }
    }

    function mkObject(data: any, properties: DB.Property[]) {
        return toMap(properties, x => x.fieldName || x.id, x => mkValue(data[x.id], x.type));
    }

    return mkObject(content, structure.properties);
}

function getContentData(obj: DB.Data, structure: DB.Structure) {
    function mkValue(value: any, type: DB.Type): any {
        if (value === undefined || value === null) {
            return null;
        } else if (type.name == "object") {
            return mkObject(value, type.arguments.properties);
        } else if (type.name == "array") {
            return value.map((item: any) => mkValue(item, type.arguments.type));
        } else {
            return value;
        }
    }

    function mkObject(data: any, properties: DB.Property[]) {
        return toMap(properties, x => x.id, x => mkValue(data[x.fieldName || x.id], x.type));
    }

    return mkObject(obj, structure.properties);
}

async function getContentByReactor(formatId: string, defaultStructureId: string) {
    const structureSnap = await ref.formats.doc(formatId).structures.doc(defaultStructureId).get();
    const structure = structureSnap.data();
    if (!structure) {
        throw null;
    }

    const reactorSnap = await ref.reactors.doc(formatId).get();
    const reactor = reactorSnap.data();
    if (!reactor) {
        throw null;
    }
    if (!reactor.definitionId) {
        throw { error: "定義コンテンツが指定されていません" };
    }
    const definition = await getContent(reactor.definitionId);
    const reactorStructureSnap = await ref.formats.doc(definition.formatId).structures.doc(definition.structureId).get();
    const reactorStructure = reactorStructureSnap.data();
    if (!reactorStructure) {
        throw null;
    }
    const definitionObj = getContentObject(definition.data, reactorStructure);

    let code = "const exports = {};"
    code += definitionObj.code;
    code += "return exports;";

    // Functionコンストラクタによって作成される関数は、トップレベルスコープのクロージャである。
    // ブラウザ上では、トップレベルスコープはグローバルスコープだが、
    // Cloud Functionsが実行されるNodeJs上では、トップレベルスコープはグローバルスコープではない。
    // そのため、セキュリティ上の問題はない。
    async function request(url: string) {
        const response = await axios.request({ url });
        console.log(response.data);
        return response.data;
    }
    const imports = Function("request", code)(request);

    return {
        structure, imports
    };
}

interface ContentWithId extends DB.Content {
    contentId: string
}

async function upsertContent(contentData: DB.Data, creator: string, format: DB.Format, structure: DB.Structure, formatId: string, containerId: string): Promise<ContentWithId> {
    const containerRef = ref.containers.doc(containerId);
    const contentsRef = containerRef.items;
    if (!format.semanticId) {
        throw null;
    }
    const semanticId = (contentData as any)[format.semanticId];
    const cacheSnaps = await contentsRef.where("data." + format.semanticId, "==", semanticId).get();
    const time = timestamp();
    const indexes = PS.getContentIndexes({ props: structure.properties, data: contentData });

    if (cacheSnaps.empty) {
        const contentId = genId();
        const content = {
            indexes: indexes,
            formatId: formatId,
            structureId: format.defaultStructureId,
            createdAt: time,
            creatorUserId: creator,
            version: 1,
            viewCount: 0,
            updateCount: 1,

            updatedAt: time,
            updaterUserId: creator,
            data: contentData
        };

        const batch = new DB.Batch();
        batch.create(ref.contents.doc(contentId), { containerId, formatId: formatId, structureId: format.defaultStructureId });
        batch.create(contentsRef.doc(contentId), content);
        batch.update(ref.containers.doc(containerId), { itemCount: DB.increment(1) });
        await batch.commit();
        return { ...content, contentId };
    } else {
        const cacheSnap = cacheSnaps.docs[0];
        const cache = cacheSnap.data();

        const diffContent: Partial<DB.Content> = {
            indexes: indexes,
            structureId: format.defaultStructureId,
            updateCount: DB.increment(1),
            data: contentData,
            updatedAt: time,
            updaterUserId: creator
        };
        const batch = new DB.Batch();
        if (cache.structureId != format.defaultStructureId) {
            batch.update(ref.contents.doc(cacheSnap.id), { structureId: format.defaultStructureId });
        }
        batch.update(new DB.DocumentReference(cacheSnap.ref), diffContent);
        await batch.commit();

        return { ...cache, ...diffContent, contentId: cacheSnap.id, updateCount: cache.updateCount as number + 1 };
    }
}

export const getContentBySemanticId = onCall<{
    formatId: string,
    semanticId: string
}>(async (data, context) => {
    const formatSnap = await ref.formats.doc(data.formatId).get();
    const format = formatSnap.data();
    if (!format) {
        return { error: "このフォーマットは存在しません" };
    }

    if (format.generator == "reactor") {
        const { structure, imports } = await getContentByReactor(data.formatId, format.defaultStructureId);
        const contentObj = await imports.get(data.semanticId);
        const contentData = getContentData(contentObj, structure);
        const containerId = await getContainerId(format.spaceId, data.formatId);
        return await upsertContent(contentData, "reactor", format, structure, data.formatId, containerId);
    } else {
        return null;
    }
});

export const getContentsByReactor = onCall<{
    formatId: string,
    words: string,
    conditions: any
}>(async (data, context) => {
    const formatSnap = await ref.formats.doc(data.formatId).get();
    const format = formatSnap.data();
    if (!format) {
        return { error: "このフォーマットは存在しません" };
    }
    if (format.generator != "reactor") {
        return { error: "Reactorが設定されていません" };
    }

    const { structure, imports } = await getContentByReactor(data.formatId, format.defaultStructureId);
    const contentObjs = await imports.list(data.words, data.conditions);
    const contentDatas = contentObjs.map((contentObj: any) => getContentData(contentObj, structure));

    const time = timestamp();
    function toContent(contentData: any): DB.Content {
        if (!format) {
            throw null;
        }
        return {
            indexes: {},
            structureId: format.defaultStructureId,
            createdAt: time,
            creatorUserId: "reactor",
            version: 1,
            viewCount: 0,
            updateCount: 1,

            updatedAt: time,
            updaterUserId: "reactor",
            data: contentData
        };
    }

    const contents = contentDatas.map(toContent);
    console.log(contents);
    return contents;
});

export const updateFormatStructure = onCall<{
    formatId: string,
    properties: DB.Property[]
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    const formatRef = ref.formats.doc(data.formatId)
    const formatSnap = await formatRef.get();
    const format = formatSnap.data();
    if (!format) {
        return { error: "このフォーマットは存在しません" };
    }

    const structureRef = formatRef.structures.doc(format.defaultStructureId);
    const structureSnap = await structureRef.get();
    const structure = structureSnap.data();
    if (!structure) {
        return { error: "このストラクチャは存在しません" };
    }

    const properties = PS.normalizeStructure(data.properties);
    const changeType = PS.getStructureChangeType({ before: structure.properties, after: data.properties });
    console.log(changeType);
    if (changeType == "none") {
        return { error: "変化ありません" };
    } else if (changeType == "major") {
        const newVersion = (parseInt(format.defaultStructureId) + 1).toString();
        const structure = {
            properties: properties
        };
        const newFormat = {
            updatedAt: timestamp(),
            updaterUserId: context.auth.uid,
            defaultStructureId: newVersion,
            relations: PS.getStructureRelations(data.properties)
        };
        const batch = new DB.Batch();
        batch.create(formatRef.structures.doc(newVersion), structure);
        batch.update(formatRef, newFormat);
        await batch.commit();
        return {};
    } else if (changeType == "minor") {
        const newStructure = {
            properties: properties,
        };
        const newFormat = {
            updatedAt: timestamp(),
            updaterUserId: context.auth.uid,
            relations: PS.getStructureRelations(data.properties)
        };
        const batch = new DB.Batch();
        batch.update(structureRef, newStructure);
        batch.update(formatRef, newFormat);
        await batch.commit();
        return {};
    } else {
        return { error: "エラー" };
    }
});

export const createCrawler = onCall<{
    spaceId: string,
    definitionId: string,
    displayName: string
}>(async (data, context) => {
    const crawlerId = genId();
    const crawler = {
        spaceId: data.spaceId,
        definitionId: data.definitionId,
        displayName: data.displayName,
        updatedAt: timestamp(),
        updaterUserId: "reactor"
    };
    await ref.crawlers.doc(crawlerId).create(crawler);
    return crawlerId;
});

async function getContent(contentId: string) {
    const junctionSnap = await ref.contents.doc(contentId).get();
    const junction = junctionSnap.data();
    if (!junction) {
        throw new NotExists("content");
    }
    const container = (await ref.containers.doc(junction.containerId).get()).data();
    if (!container) {
        throw new NotExists("container");
    }
    const content = await (await ref.containers.doc(junction.containerId).items.doc(contentId).get()).data();
    if (!content) {
        throw new NotExists("content");
    }
    return { ...content, ...container };
}

async function getCrawler(crawlerId: string) {
    const crawlerSnap = await ref.crawlers.doc(crawlerId).get();
    const crawler = crawlerSnap.data();
    if (!crawler) {
        throw "not found crawler";
    }
    const definition = await getContent(crawler.definitionId);
    const crawlerStructureSnap = await ref.formats.doc(definition.formatId).structures.doc(definition.structureId).get();
    const crawlerStructure = crawlerStructureSnap.data();
    if (!crawlerStructure) {
        throw new NotExists("structure")
    }
    const definitionObj = getContentObject(definition.data, crawlerStructure);

    return {
        crawler, crawlerDefinition: definitionObj
    };
}

async function getScraper(contentId: string) {
    const scraper = await getContent(contentId);
    if (!scraper) {
        throw "not found scraper";
    }
    const scraperStructureSnap = await ref.formats.doc(scraper.formatId).structures.doc(scraper.structureId).get();
    const scraperStructure = scraperStructureSnap.data();
    if (!scraperStructure) {
        throw "not found scraper's structure";
    }
    return getContentObject(scraper.data, scraperStructure) as {
        outputContents: { kind: string, format: string }[],
        outputIndexes: { kind: string, scraper: string }[],
        code: string
    };
}

async function getTaskMethodAndCacheId(operationMethod: string, crawlerId: string, url: string) {
    if (operationMethod == "crawling") {
        return { method: "crawling" as "crawling", cacheId: genId() };
    } else /*if (operationMethod == "scraping")*/ {
        const cachesSnap = await ref.crawlers.doc(crawlerId).caches.where("url", "==", url).get();
        if (cachesSnap.empty) {
            return { method: "crawling" as "crawling", cacheId: genId() }
        } else {
            return { method: "scraping" as "scraping", cacheId: cachesSnap.docs[0].id }
        }
    }
}

export const runCrawler = onCall<{
    crawlerId: string,
    method: string
}>(async (data, context) => {
    if (!isLogined(context.auth)) {
        return;
    }

    // create operation
    const time = timestamp();
    const operationId = genId();
    const operation = {
        status: "running",
        createdAt: time,
        method: data.method,
        executorUserId: context.auth.uid,
        contentCount: 0,
        fetchingCount: 0,
        scrapingCount: 0,
        startedAt: null,
        endedAt: null
    };
    const crawlerRef = ref.crawlers.doc(data.crawlerId);
    const runningOperationsSnap = await crawlerRef.operations.where("status", "==", "running").get();
    //  if (!provOperationsSnap.empty || !runningOperationsSnap.empty) {
    //     return { error: "このクローラーは既に実行されています" };
    // }
    const operationRef = crawlerRef.operations.doc(operationId);
    await operationRef.create(operation);

    // create tasks
    const ent = await getCrawler(data.crawlerId);
    await Promise.all(ent.crawlerDefinition.startups.map(async (startup: any) => {
        const taskId = genId();
        const { method, cacheId } = await getTaskMethodAndCacheId(data.method, data.crawlerId, startup.url);
        const task: DB.Task = {
            url: startup.url,
            scraperId: startup.scraper,
            createdAt: time,
            status: "pending",
            method: method,
            cacheId: cacheId,
            output: null,
            message: null,
            startedAt: null,
            endedAt: null
        };
        const taskMsg: TaskMessage = {
            ...task,
            taskId: taskId,
            operationId: operationId,
            crawlerId: data.crawlerId,
            spaceId: ent.crawler.spaceId,
            scrapingCode: (await getScraper(task.scraperId)).code
        };
        await operationRef.tasks.doc(taskId).create(task);
        await crawlingTopic.publishJSON(taskMsg);
    }));
    return {};
});

const crawlerAuth = "c95b763282404389a6024a9d6a55f53f576c442746c44fccbf7490679b29d129";

export const beginCrawlingTask = onCall<{
    crawlerId: string,
    operationId: string
    taskId: string,
    auth: string
}>(async (data, context) => {
    if (data.auth != crawlerAuth) {
        return { error: "認証エラー" }
    }

    const crawlerRer = ref.crawlers.doc(data.crawlerId);
    const operationRef = crawlerRer.operations.doc(data.operationId);
    const taskRef = operationRef.tasks.doc(data.taskId);
    const task = (await taskRef.get()).data();
    const time = timestamp();

    const operation = (await operationRef.get()).data();
    if (!operation) {
        return { error: "このオペレーションは存在しません" };
    }
    if (operation.status == "provisioning") {
        const newOperation = {
            startedAt: time,
            status: "running"
        };
        await operationRef.update(newOperation);
    }

    if (!task) {
        return { error: "このタスクは存在しません" };
    }
    if (task.method == "crawling") {
        await operationRef.update({ fetchingCount: DB.increment(1), scrapingCount: DB.increment(1) });
    } else if (task.method == "scraping") {
        await operationRef.update({ scrapingCount: DB.increment(1) });
    }

    if (task.status == "pending") {
        const newTask: Partial<DB.Task> = {
            startedAt: time,
            status: "running"
        };
        await taskRef.update(newTask);
        return true;
    } else {
        return false;
    }
});

export interface TaskMessage extends DB.Task {
    taskId: string,
    operationId: string,
    crawlerId: string,
    spaceId: string,
    scrapingCode: string
}

// data = { crawlerId: string, operationId: string, taskId: string, contents: [{ kind: string, data: obj }], indexes: [{ kind: string, url: string }] }
export const completeCrawlingTask = onCall<{
    crawlerId: string,
    operationId: string
    taskId: string,
    auth: string,
    indexes: { kind: string, url: string }[],
    contents: { kind: string, data: any }[]
}>(async (data, context) => {
    if (data.auth != crawlerAuth) {
        return { error: "認証エラー" }
    }

    const crawlerRef = ref.crawlers.doc(data.crawlerId);
    const crawler = (await crawlerRef.get()).data();
    if (!crawler) {
        return { error: "このクローラーは存在しません" };
    }
    const operationRef = crawlerRef.operations.doc(data.operationId);
    const operation = (await operationRef.get()).data();
    if (!operation) {
        return { error: "このオペレーションは存在しません" };
    }
    const taskRef = operationRef.tasks.doc(data.taskId);
    const task = (await taskRef.get()).data();
    if (!task) {
        return { error: "このタスクは存在しません" };
    }

    let resultIndexes, resultContents;
    try {
        const scraper = await getScraper(task.scraperId);
        const indexMap = toMap(scraper.outputIndexes, x => x.kind, x => x.scraper);
        const contentMapPromises = scraper.outputContents.map(async x => {
            const formatRef = ref.formats.doc(x.format);
            const format = (await formatRef.get()).data();
            if (!format) {
                throw { error: "このフォーマットは存在しません" };
            }

            const structureRef = formatRef.structures.doc(format.defaultStructureId);
            const structure = (await structureRef.get()).data();
            if (!structure) {
                throw new NotExists("structure");
            }
            const containerId = await getContainerId(format.spaceId, x.format);
            return {
                kind: x.kind,
                format: format,
                structure: structure,
                formatId: x.format,
                containerId: containerId
            };
        });

        type ContentMapElm = { kind: string, format: DB.Format, structure: DB.Structure, formatId: string };
        const contentMap = toMap(await Promise.all(contentMapPromises), x => x.kind, x => x);

        resultIndexes = await Promise.all(data.indexes.map(async index => {
            const oldTasks = await operationRef.tasks.where("url", "==", index.url).get();
            if (oldTasks.empty) {
                const { method, cacheId } = await getTaskMethodAndCacheId(operation.method, data.crawlerId, index.url);
                const taskId = genId();
                const task: DB.Task = {
                    url: index.url,
                    scraperId: indexMap[index.kind],
                    createdAt: timestamp(),
                    status: "pending",
                    method: method,
                    cacheId: cacheId,
                    output: null,
                    message: null,
                    startedAt: null,
                    endedAt: null
                };
                const taskMsg: TaskMessage = {
                    ...task,
                    taskId: taskId,
                    operationId: data.operationId,
                    crawlerId: data.crawlerId,
                    spaceId: crawler.spaceId,
                    scrapingCode: (await getScraper(task.scraperId)).code
                };
                await operationRef.tasks.doc(taskId).create(task);
                await crawlingTopic.publishJSON(taskMsg);

                return {
                    url: index.url,
                    taskId: taskId,
                    class: "new"
                };
            } else {
                return {
                    url: index.url,
                    taskId: null,
                    class: "duplication"
                };
            }
        }));

        resultContents = await Promise.all(data.contents.map(async content => {
            const { formatId, format, structure, containerId } = contentMap[content.kind];
            const errors = PS.validateContentObject({ props: structure.properties, data: content.data });
            if (errors.length > 0) {
                throw new BatchUsersError("出力コンテンツ(kind:" + content.kind + ")のフォーマットが適切ではありません\n" + errors.join("\n"));
            }
            const contentData = getContentData(content.data, structure);
            const newContent = await upsertContent(contentData, "crawler", format, structure, formatId, containerId);
            return { contentId: newContent.contentId, version: newContent.version }
        }));
    } catch (e) {
        if (e instanceof BatchUsersError) {
            await _failedCrawlingTask(operationRef, taskRef, "importing", e.error);
            console.log(e.error);
            return { error: e.error };
        } else {
            await _failedCrawlingTask(operationRef, taskRef, "importing", "内部エラー");
            throw e;
        }
    }

    // update opration
    await operationRef.update({ contentCount: DB.increment(resultContents.length) });

    // complete task
    const newTask: Partial<DB.Task> = {
        status: "completed",
        output: { indexes: resultIndexes, contents: resultContents },
        endedAt: timestamp()
    };
    await taskRef.update(newTask);
    
    await checkOperationCompletion(operationRef);

    return {};
});

async function checkOperationCompletion(operationRef: DB.OperationReference) {
    const pendingTasks = await operationRef.tasks.where("status", "==", "pending").get();
    const runningTasks = await operationRef.tasks.where("status", "==", "running").get();
    if (pendingTasks.empty && runningTasks.empty) {
        const newOperation = {
            status: "completed",
            endedAt: timestamp()
        }
        await operationRef.update(newOperation);
    }
}

async function _failedCrawlingTask(operationRef: DB.OperationReference, taskRef: DB.DocumentReference<DB.Task>, phase: string, message: string) {
    const newTask: Partial<DB.Task> = {
        status: "failed_" + phase as "failed_fetching" | "failed_scraping" | "failed_importing",
        message: message,
        endedAt: timestamp()
    };
    await taskRef.update(newTask);
    await checkOperationCompletion(operationRef);
}

export const failedCrawlingTask = onCall<{
    crawlerId: string,
    operationId: string
    taskId: string,
    auth: string,
    phase: string,
    message: string
}>(async (data, context) => {
    if (data.auth != crawlerAuth) {
        return { error: "認証エラー" }
    }

    const crawlerRef = ref.crawlers.doc(data.crawlerId);
    const operationRef = crawlerRef.operations.doc(data.operationId);
    const taskRef = operationRef.tasks.doc(data.taskId);
    const task = (await taskRef.get()).data();
    if (!task) {
        return { error: "このタスクは存在しません" };
    }
    if (task.status == "running") {
        await _failedCrawlingTask(operationRef, taskRef, data.phase, data.message)
    }
    return {};
});