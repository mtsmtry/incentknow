import { SelectQueryBuilder } from "typeorm";
import { ContentDraftId } from "../../../entities/content/ContentDraft";
import { ContentEditing, ContentEditingId, ContentEditingSk } from "../../../entities/content/ContentEditing";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class ContentEditingQuery extends SelectFromSingleTableQuery<ContentEditing, ContentEditingQuery, ContentEditingSk, ContentEditingId, null> {
    constructor(qb: SelectQueryBuilder<ContentEditing>) {
        super(qb, ContentEditingQuery);
    }

    byDraft(draftId: ContentDraftId) {
        return new ContentEditingQuery(this.qb.where({ draftId }));
    }
}