import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentDraft, ContentDraftId, ContentDraftSk } from "../../../entities/content/ContentDraft";
import { UserSk } from "../../../entities/user/User";
import { toFocusedContentDraft, toRelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedMaterialDraft } from "../../../interfaces/material/MaterialDraft";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class ContentDraftQuery extends SelectFromSingleTableQuery<ContentDraft, ContentDraftQuery, ContentDraftSk, ContentDraftId, null>  {
    constructor(qb: SelectQueryBuilder<ContentDraft>) {
        super(qb, ContentDraftQuery);
    }

    byUser(userId: UserSk) {
        return new ContentDraftQuery(this.qb.where({ userId }));
    }

    byContent(contentId: ContentSk) {
        return new ContentDraftQuery(this.qb.where({ contentId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("content", "content")
            .leftJoinAndSelect("currentEditing", "currentEditing");
        return mapQuery(query, toRelatedContentDraft);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("content", "content")
            .leftJoinAndSelect("intendedContentDraft", "intendedContentDraft")
            .leftJoinAndSelect("currentEditing", "currentEditing");

        return mapQuery(query, x => (m: FocusedMaterialDraft[]) => {
            const data = x.data;
            return data ? toFocusedContentDraft(x, data, m) : null;
        });
    }
}

export class ContentDraftQueryFromEntity extends SelectQueryFromEntity<ContentDraft> {
    constructor(draft: ContentDraft) {
        super(draft);
    }

    async getRelated() {
        return toRelatedContentDraft(this.raw);
    }
}