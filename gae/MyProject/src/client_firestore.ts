import * as admin from 'firebase-admin';


const serviceAccount = require("./../service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incentknow.firebaseio.com"
});

const db = admin.firestore();

type FirestoreNumber = number | FirebaseFirestore.FieldValue;

type NotUndefinedUnary = string | number | boolean | symbol;

type NotIncludeUndefined = NotUndefinedUnary | { [key: string]: NotIncludeUndefined };

export type Data = NotIncludeUndefined;

export interface User {
}

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

export interface SpaceActivity {
    contentId: string,
    formatId: string,
    target: string,
    timestamp: FirestoreNumber,
    type: string,
    userId: string
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

export class UserReference extends DocumentReference<User> {
    get works() {
        return new CollectionReference(this.ref.collection("works") as FirebaseFirestore.CollectionReference<Work>, WorkReference);
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

    get crawlers() {
        return new CollectionReference(db.collection("crawlers") as FirebaseFirestore.CollectionReference<Crawler>, CrawlerReference);
    }

    get users() {
        return new CollectionReference(db.collection("users") as FirebaseFirestore.CollectionReference<User>, UserReference);
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
