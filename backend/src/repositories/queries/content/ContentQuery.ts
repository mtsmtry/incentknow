import { SelectQueryBuilder } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { toFocusedContent, toRelatedContent } from "../../../interfaces/content/Content";
import { RelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedFormat } from "../../../interfaces/format/Format";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class ContentQuery extends SelectFromSingleTableQuery<Content, ContentQuery, ContentSk, ContentId, null> {
    constructor(qb: SelectQueryBuilder<Content>) {
        super(qb, ContentQuery);
    }

    byContainer(containerId: ContainerSk) {
        return new ContentQuery(this.qb.where({ containerId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContent(x, f));
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .leftJoinAndSelect("materials", "materials")
            .addSelect("data");

        return mapQuery(query, x => (f: FocusedFormat, d: RelatedContentDraft) => toFocusedContent(x, d, f));
    }
}

export class ContentQueryFromEntity extends SelectQueryFromEntity<Content> {
    constructor(content: Content) {
        super(content);
    }
}