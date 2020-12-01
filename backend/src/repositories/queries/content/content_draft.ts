import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/content";
import { ContentDraft, ContentDraftId, ContentDraftSk } from "../../../entities/content/content_draft";
import { UserSk } from "../../../entities/user/user";
import { toFocusedContentDraft, toRelatedContentDraft } from "../../../interfaces/content/content_draft";
import { FocusedMaterialDraft } from "../../../interfaces/material/material_draft";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

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
        const query = this.qb;
        return mapQuery(query, toRelatedContentDraft);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("content", "content")
            .leftJoinAndSelect("intendedContentDraft", "intendedContentDraft");
            
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