import { CrawlerCache, CrawlerCacheStatus } from "../../entities/crawler/crawler_cache";
import { ContentId } from "../content/content";
import { CrawlerOperationId } from "./crawler_operation";

export type CrawlerCacheId = number;

export interface IntendCrawlerCache {
    cacheId: CrawlerCacheId;
    operationId: CrawlerOperationId;
    scraperId: ContentId;
    url: string;
    status: CrawlerCacheStatus;
    createdAt: number;
    updatedAt: number;
}

function toIntendCrawlerCache(cache: CrawlerCache): IntendCrawlerCache {
    return {
        cacheId: cache.id,
        operationId: cache.operationId,
        scraperId: cache.scraper.entityId,
        url: cache.url,
        status: cache.status,
        createdAt: toTimestamp(cache.createdAt),
        updatedAt: toTimestamp(cache.updatedAt)
    }
}