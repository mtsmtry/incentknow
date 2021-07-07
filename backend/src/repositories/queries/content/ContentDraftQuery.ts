import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentDraft, ContentDraftId, ContentDraftSk } from "../../../entities/content/ContentDraft";
import { UserSk } from "../../../entities/user/User";
import { toFocusedContentDraft, toRelatedContentDraft } from "../../../interfaces/content/ContentDraft";
import { FocusedFormat } from "../../../interfaces/format/Format";
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

    selectRaw() {
        return new ContentDraftQuery(this.qb.addSelect("x.data"));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("x.structure", "structure")
            .leftJoinAndSelect("structure.format", "format");
        return mapQuery(query, x => (f: FocusedFormat) => toRelatedContentDraft(x, f));
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("x.structure", "structure")
            .leftJoinAndSelect("structure.format", "format")
            .addSelect("x.data");
        return mapQuery(query, x => (f: FocusedFormat, m: FocusedMaterialDraft[]) => {
            const data = x.data;
            return data ? toFocusedContentDraft(x, f, data, m) : null;
        });
    }
}

export class ContentDraftQueryFromEntity extends SelectQueryFromEntity<ContentDraft> {
    constructor(draft: ContentDraft) {
        super(draft);
    }

    async getRelated() {
        return (f: FocusedFormat) => toRelatedContentDraft(this.raw, f);
    }
}