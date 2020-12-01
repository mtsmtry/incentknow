import { ContentId } from "../../entities/content/content";
import { CrawlerCache, CrawlerCacheStatus } from "../../entities/crawler/crawler_cache";
import { CrawlerOperationId } from "./crawler_operation";

export interface IntendCrawlerCache {
    cacheId: number;
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