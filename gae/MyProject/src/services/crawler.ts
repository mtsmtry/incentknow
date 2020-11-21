import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { Container, Content, ContentGenerator, Crawler, CrawlerOperationMethod, CrawlerTaskOutput, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { FocusedFormat, RelatedFormat, toIntactCrawler, IntactCrawler, FormatDisplayId, PropertyInfo, toFocusedFormat, toRelatedFormat, toFocusedFormatFromStructure, SpaceId, Type, ContentId, CrawlerId, CrawlerTaskId } from './utils_entities';
import * as formatUtils from './utils_format';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;

export async function createCrawler(
    spaceId: SpaceId,
    definitionId: ContentId,
    displayName: string
): Promise<IntactCrawler> {
    // get user　
    const user = await base.getMyUser();

    // get space
    const space = await Space.findOne({ entityId: spaceId })

    // get definition
    const definition = await Content.findOne({ entityId: definitionId });

    let crawler = Crawler.create({
        space,
        definition,
        creatorUser: user,
        updaterUser: user,
        displayName: displayName
    });

    return toIntactCrawler(crawler, null);
}

export async function getCrawlers(
    spaceId: SpaceId
): Promise<IntactCrawler[]> {

    // get space
    const space = await Space.findOne(spaceId);

    // get crawlers
    const crawlers = await Crawler.createQueryBuilder("crawler")
        .where("crawler.space = :space")
        .setParameter("space", space)
        .getMany();

    return crawlers.map(x => toIntactCrawler(x, null));
}

export async function getCrawler(
    crawlerId: CrawlerId
): Promise<IntactCrawler> {
}

export async function runCrawler(
    crawlerId: CrawlerId,
    method: CrawlerOperationMethod
): Promise<{}> {

}

export async function beginCrawlingTask(
    taskId: CrawlerTaskId
): Promise<{}> {

}

export async function completeCrawlingTask(
    taskId: CrawlerTaskId,
    output: CrawlerTaskOutput
): Promise<{}> {

}

export async function failedCrawlingTask(
    taskId: CrawlerTaskId,
    phase: string,
    message: string
): Promise<{}> {

}