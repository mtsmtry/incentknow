import * as admin from 'firebase-admin';
import { database } from 'firebase-functions/lib/providers/firestore';
import { user } from 'firebase-functions/lib/providers/auth';

const serviceAccount = require("../service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incentknow.firebaseio.com"
});

const db = admin.firestore();

type FirestoreNumber = number | FirebaseFirestore.FieldValue;

type NotUndefinedUnary = string | number | boolean | symbol;

type NotIncludeUndefined = NotUndefinedUnary | { [key: string]: NotIncludeUndefined };

export type Data = NotIncludeUndefined;

export interface Work {
    createdAt: number,
    updatedAt: number,
    formatId: string,
    structureId: string,
    data: Data,
    change: "initial" | "complex" | "increase" | "decrease",
    state: "working" | "committed" | "deleted",
    workingChangeId: string | null,
    contentId: string | null,
    spaceId: string | null
}

export interface Snapshot {
    data: Data,
    timestamp: FirestoreNumber,
    structureId: string
}

export interface Task {
    url: string,
    scraperId: string,
    createdAt: number,
    status: "pending" | "running" | "completed" | "failed_fetching" | "failed_scraping" | "failed_importing",
    method: "crawling" | "scraping",
    cacheId: string,
    output: { indexes: { url: string, taskId: string | null, class: string }[], contents: { contentId: string, version: FirestoreNumber }[] } | null,
    message: string | null,
    startedAt: number | null,
    endedAt: number | null
}

export interface Crawler {
    definitionId: string,
    displayName: string,
    spaceId: string,
    updatedAt: number,
    updaterUserId: string
}

export interface Reactor {
    spaceId: string,
    formatId: string,
    state: string,
    definitionId: string | null,
    createdAt: number,
    creatorUserId: string
}

export interface Space {
    createdAt: number,
    creatorUserId: string,
    description: string,
    displayId: string,
    displayName: string,
    homeUrl: string | null,
    formatCount: FirestoreNumber,
    committerCount: FirestoreNumber,
    memberCount: FirestoreNumber,
    membershipMethod: string,
    published: boolean,
    authority: { base: string }
}

export interface User {
    displayId: string,
    displayName: string,
    iconUrl: string | null
}

export interface SpaceMember {
    joinedAt: number | null,
    appliedAt: number | null,
    type: "normal" | "pending" | "owner"
}

export interface SpaceCommitter {
    commitCount: FirestoreNumber,
    contentCount: FirestoreNumber,
    firstCommittedAt: number,
    lastCommittedAt: number
}

export interface SpaceActivity {
    contentId: string,
    formatId: string,
    target: string,
    timestamp: FirestoreNumber,
    type: string,
    userId: string
}

export interface Container {
    spaceId: string,
    formatId: string,
    itemCount: FirestoreNumber
}

export interface ContentRelation {
    formatId: string,
    displayName: string,
    property: string
}

export interface ContentPage {
    relations: ContentRelation[]
}

export interface ContentComposition {
    type: string,
    details: any
}

export interface CollectionPage {
    compositions: ContentComposition[]
}

export interface Format {
    createdAt: number,
    creatorUserId: string,
    description: string,
    displayId: string,
    displayName: string,
    generator: string,
    defaultStructureId: string,
    semanticId: string | null,
    spaceId: string,
    updatedAt: number,
    updaterUserId: string,
    usage: string,
    relations: string[],
    contentPage: ContentPage,
    collectionPage: CollectionPage
}

export interface Property {
    displayName: string,
    fieldName: string | null,
    id: string,
    optional: boolean,
    semantic: string | null,
    type: Type
}

export interface Type {
    name: string;
    arguments: any;
}

export interface Structure {
    properties: Property[]
}

export interface Indexes {
    [key: string]: (string | number | boolean)[];
}

export interface Content {
    createdAt: number,
    creatorUserId: string,
    data: Data,
    structureId: string,
    updateCount: FirestoreNumber,
    updatedAt: number,
    updaterUserId: string,
    version: FirestoreNumber,
    viewCount: FirestoreNumber,
    indexes: Indexes
}

export interface UserSpace {
    createdAt: number,
    type: string
}

export interface Operation {
    contentCount: FirestoreNumber
    createdAt: number,
    endedAt: number | null,
    executorUserId: string,
    fetchingCount: FirestoreNumber,
    method: string
    scrapingCount: FirestoreNumber,
    startedAt: number | null,
    status: string
}

export interface Commit {
    data: Data,
    structureId: string,
    timestamp: number,
    userId: string,
    version: number
}

export interface Change {
    createdAt: number;
    updatedAt: number;
}

export interface UserSetting {
    defaultSpaceId: string
}

export interface Cache {
    cacheId: string
    operationId: string
    scraperId: string
    crawlerId: string
    url: string
    status: string
    timestamp: number
}

class CollectionReference<T, TRef extends DocumentReference<T>> {
    constructor(
        private ref: FirebaseFirestore.CollectionReference<T>,
        private newDocRef: new (ref: FirebaseFirestore.DocumentReference<T>) => TRef) {
    }

    where(fieldPath: string | FirebaseFirestore.FieldPath, opStr: FirebaseFirestore.WhereFilterOp, value: any) {
        return this.ref.where(fieldPath, opStr, value);
    }

    doc(documentPath: string) {
        return new this.newDocRef(this.ref.doc(documentPath))
    }

    get() {
        return this.ref.get();
    }
}

export class DocumentReference<T> {
    ref: FirebaseFirestore.DocumentReference<T>;

    constructor(ref: FirebaseFirestore.DocumentReference<T>) {
        this.ref = ref;
    }

    get() {
        return this.ref.get();
    }

    create(data: T) {
        return this.ref.create(data);
    }

    update(data: Partial<T>) {
        return this.ref.update(data);
    }

    delete() {
        return this.ref.delete();
    }
}

export class SpaceReference extends DocumentReference<Space> {
    get members() {
        return new CollectionReference(this.ref.collection("members") as FirebaseFirestore.CollectionReference<SpaceMember>, DocumentReference);
    }

    get committers() {
        return new CollectionReference(this.ref.collection("committers") as FirebaseFirestore.CollectionReference<SpaceCommitter>, DocumentReference);
    }

    get activities() {
        return new CollectionReference(this.ref.collection("activities") as FirebaseFirestore.CollectionReference<SpaceActivity>, DocumentReference);
    }
}

export class ContainerReference extends DocumentReference<Container> {
    get items() {
        return new CollectionReference(this.ref.collection("items") as FirebaseFirestore.CollectionReference<Content>, DocumentReference);
    }
}
export class UserReference extends DocumentReference<User> {
    get works() {
        return new CollectionReference(this.ref.collection("works") as FirebaseFirestore.CollectionReference<Work>, WorkReference);
    }

    get followingSpaces() {
        return new CollectionReference(this.ref.collection("followingSpaces") as FirebaseFirestore.CollectionReference<UserSpace>, DocumentReference);
    }
}

export class WorkReference extends DocumentReference<Work> {
    get changes() {
        return new CollectionReference(this.ref.collection("changes") as FirebaseFirestore.CollectionReference<Change>, ChangeReference);
    }
}

export class ChangeReference extends DocumentReference<Change> {
    get snapshots() {
        return new CollectionReference(this.ref.collection("snapshots") as FirebaseFirestore.CollectionReference<Snapshot>, DocumentReference);
    }
}

export class FormatReference extends DocumentReference<Format> {
    get structures() {
        return new CollectionReference(this.ref.collection("structures") as FirebaseFirestore.CollectionReference<Structure>, DocumentReference);
    }
}

export class JunctionReference extends DocumentReference<Junction> {
    get commits() {
        return new CollectionReference(this.ref.collection("commits") as FirebaseFirestore.CollectionReference<Commit>, DocumentReference);
    }
}

export class CrawlerReference extends DocumentReference<Crawler> {
    get operations() {
        return new CollectionReference(this.ref.collection("crawlerOperations") as FirebaseFirestore.CollectionReference<Operation>, OperationReference);;
    }

    get caches() {
        return new CollectionReference(this.ref.collection("crawlerCaches") as FirebaseFirestore.CollectionReference<Cache>, DocumentReference);;
    }
}

export class OperationReference extends DocumentReference<Operation> {
    get tasks() {
        return new CollectionReference(this.ref.collection("crawlerTasks") as FirebaseFirestore.CollectionReference<Task>, DocumentReference);;
    }
}

export interface Junction {
    containerId: string;
    formatId: string;
    structureId: string;
}

export class Reference {
    get contents() {
        return new CollectionReference(db.collection("contents") as FirebaseFirestore.CollectionReference<Junction>, JunctionReference);
    }

    get containers() {
        return new CollectionReference(db.collection("containers") as FirebaseFirestore.CollectionReference<Container>, ContainerReference);
    }

    get crawlers() {
        return new CollectionReference(db.collection("crawlers") as FirebaseFirestore.CollectionReference<Crawler>, CrawlerReference);
    }

    get reactors() {
        return new CollectionReference(db.collection("reactors") as FirebaseFirestore.CollectionReference<Reactor>, DocumentReference);
    }

    get spaces() {
        return new CollectionReference(db.collection("spaces") as FirebaseFirestore.CollectionReference<Space>, SpaceReference);
    }

    get users() {
        return new CollectionReference(db.collection("users") as FirebaseFirestore.CollectionReference<User>, UserReference);
    }

    get formats() {
        return new CollectionReference(db.collection("formats") as FirebaseFirestore.CollectionReference<Format>, FormatReference);
    }

    get userSettings() {
        return new CollectionReference(db.collection("_users") as FirebaseFirestore.CollectionReference<UserSetting>, DocumentReference);
    }
}

export class Batch {
    batch: FirebaseFirestore.WriteBatch;

    constructor() {
        this.batch = db.batch();
    }

    create<T>(ref: DocumentReference<T>, data: T) {
        this.batch.create(ref.ref, data);
    }

    update<T>(ref: DocumentReference<T>, data: Partial<T>) {
        this.batch.update(ref.ref, data);
    }

    delete<T>(ref: DocumentReference<T>) {
        this.batch.delete(ref.ref);
    }

    commit() {
        return this.batch.commit();
    }
}

export function increment(num: number) {
    return admin.firestore.FieldValue.increment(num)
}

export const auth = admin.auth();
