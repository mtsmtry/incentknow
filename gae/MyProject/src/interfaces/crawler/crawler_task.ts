import { CrawlerTask, CrawlerTaskMethod, CrawlerTaskOutput } from "../../entities/crawler/crawler_task";
import { ContentId } from "../content/content";
import { CrawlerCacheId } from "./crawler_cache";

export type CrawlerTaskId = number;

export interface IntactCrawlerTask {
    taskId: CrawlerTaskId;
    scraperId: ContentId;
    displayName: string;
    createdAt: number;
    startedAt: number | null;
    endedAt: number | null;
    message: string | null;
    output: CrawlerTaskOutput;
    cacheId: CrawlerCacheId;
}

function toIntactCrawlerTask(task: CrawlerTask): IntactCrawlerTask {
    return {
        taskId: task.id,
        scraperId: task.scraper.entityId,
        displayName: task.displayName,
        createdAt: toTimestamp(task.createdAt),
        startedAt: toTimestamp(task.startedAt),
        endedAt: toTimestamp(task.endedAt),
        message: task.message,
        output: task.output,
        cacheId: task.cache.id
    }
}