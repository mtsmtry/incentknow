import { Content, Crawler, Space } from "./client_sql";
import { UtilsSpaceAuthorization } from './utils_authority';
import { UtilsBase } from './utils_base';
import { ContentId, IntactCrawler, SpaceId, toIntactCrawler } from './utils_entities';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;

export async function createCrawler(args: { spaceId: SpaceId, definitionId: ContentId, displayName: string }): Promise<IntactCrawler> {
    // get user　
    const user = await base.getMyUser();

    // get space
    const space = await Space.findOne({ entityId: args.spaceId })

    // get definition
    const definition = await Content.findOne({ entityId: args.definitionId });

    let crawler = Crawler.create({
        space,
        definition,
        creatorUser: user,
        updaterUser: user,
        displayName: args.displayName
    });

    return toIntactCrawler(crawler, null);
}

export async function getCrawlers(args: { spaceId: SpaceId }): Promise<IntactCrawler[]> {

    // get space
    const space = await Space.findOne(args.spaceId);

    // get crawlers
    const crawlers = await Crawler.createQueryBuilder("crawler")
        .where("crawler.space = :space")
        .setParameter("space", space)
        .getMany();

    return crawlers.map(x => toIntactCrawler(x, null));
}

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