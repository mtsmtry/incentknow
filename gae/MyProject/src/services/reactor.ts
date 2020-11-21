import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { Container, Content, ContentGenerator, Crawler, CrawlerOperationMethod, CrawlerTaskOutput, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { FocusedFormat, RelatedFormat, toIntactCrawler, IntactCrawler, FormatDisplayId, PropertyInfo, toFocusedFormat, toRelatedFormat, toFocusedFormatFromStructure, SpaceId, Type, ContentId, CrawlerId, CrawlerTaskId, IntactReactor, ReactorId } from './utils_entities';
import * as formatUtils from './utils_format';

export async function getReactor(args: { reactorId: ReactorId }): Promise<IntactReactor> {

}

export async function setReactorDefinitionId(args: {
    reactorId: ReactorId,
    definitionId: ContentId
}): Promise<{}> {

}