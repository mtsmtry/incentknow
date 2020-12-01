import { ContentId } from "../../entities/content/content";
import { Crawler } from "../../entities/crawler/crawler";
import { CrawlerOperation } from "../../entities/crawler/crawler_operation";
import { SpaceId } from "../space/space";
import { IntactCrawlerOperation, toIntactCrawlerOperation } from "./crawler_operation";

export type CrawlerId = string;

export interface IntactCrawler {
    crawlerId: CrawlerId;
    definitionId: ContentId;
    displayName: string;
    spaceId: SpaceId;
    updatedAt: number;
    runningOperation: IntactCrawlerOperation | null;
}

export function toIntactCrawler(crawler: Crawler, runningOperation: CrawlerOperation | null) {
    return {
        crawlerId: crawler.entityId,
        definitionId: crawler.definition.entityId,
        displayName: crawler.displayName,
        spaceId: crawler.space.entityId,
        updatedAt: toTimestamp(crawler.updatedAt),
        runningOperation: runningOperation ? toIntactCrawlerOperation(runningOperation) : null
    }
}