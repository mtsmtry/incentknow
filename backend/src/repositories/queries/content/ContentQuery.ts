import { SelectQueryBuilder } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentId, ContentSk } from "../../../entities/content/Content";
import { PropertyId } from "../../../entities/format/Property";
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

    byProperty(containerId: ContainerSk, propertyId: PropertyId, value: any) {
        const query = this.qb.where({ containerId }).andWhere(`x.data->>"$.${propertyId}" = :value`, { value });
        return new ContentQuery(query);
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .addSelect("x.data");;

        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContent(x, f));
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .leftJoinAndSelect("x.materials", "materials")
            .addSelect("x.data");

        return mapQuery(query, x => (f: FocusedFormat, d: RelatedContentDraft | null) => toFocusedContent(x, d, f));
    }

    selectAll() {
        return new ContentQuery(this.qb.addSelect("x.data"));
    }
}

export class ContentQueryFromEntity extends SelectQueryFromEntity<Content> {
    constructor(content: Content) {
        super(content);
    }
}