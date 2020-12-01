import { SelectQueryBuilder } from "typeorm";
import { Content, ContentId, ContentSk } from "../../../entities/content/content";
import { toFocusedContent, toRelatedContent } from "../../../interfaces/content/content";
import { RelatedContentDraft } from "../../../interfaces/content/content_draft";
import { FocusedFormat } from "../../../interfaces/format/format";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

export class ContentQuery extends SelectFromSingleTableQuery<Content, ContentQuery, ContentSk, ContentId, null> {
    constructor(qb: SelectQueryBuilder<Content>) {
        super(qb, ContentQuery);
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