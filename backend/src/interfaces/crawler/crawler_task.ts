import { ContentId } from "../../entities/content/content";
import { CrawlerTask, CrawlerTaskOutput } from "../../entities/crawler/crawler_task";

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
    cacheId: number;
}

function toIntactCrawlerTask(task: CrawlerTask): IntactCrawlerTask {
    return {
        taskId: task.id,
        scraperId: task.scraper.entityId,
        displayName: task.displayName,
        createdAt: toTimestamp(task.createdAt),
        startedAt: task.startedAt ? toTimestamp(task.startedAt) : null,
        endedAt: task.endedAt ? toTimestamp(task.endedAt) : null,
        message: task.message,
        output: task.output,
        cacheId: task.cache.id
    }
}