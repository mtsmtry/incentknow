import { CrawlerOperation, CrawlerOperationMethod, CrawlerOperationStatus } from "../../entities/crawler/crawler_operation";
import { RelatedUser, toRelatedUser } from "../user/user";

export type CrawlerOperationId = number;

export interface IntactCrawlerOperation {
    operationId: CrawlerOperationId;
    createdAt: number;
    executorUser: RelatedUser;
    method: CrawlerOperationMethod;
    startedAt: number | null;
    endedAt: number | null;
    status: CrawlerOperationStatus;
}

export function toIntactCrawlerOperation(operation: CrawlerOperation) {
    return {
        operationId: operation.id,
        createdAt: toTimestamp(operation.createdAt),
        executorUser: toRelatedUser(operation.executorUser),
        method: operation.method,
        startedAt: operation.startedAt ? toTimestamp(operation.startedAt) : null,
        endedAt: operation.endedAt ? toTimestamp(operation.endedAt) : null,
        status: operation.status
    }
}