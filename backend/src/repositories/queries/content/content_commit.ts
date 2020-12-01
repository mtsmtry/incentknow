import { SelectQueryBuilder } from "typeorm";
import { ContentId, ContentSk } from "../../../entities/content/content";
import { ContentCommit, ContentCommitId, ContentCommitSk } from "../../../entities/content/content_commit";
import { toFocusedContentCommit, toRelatedContentCommit } from "../../../interfaces/content/content_commit";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

export class ContentCommitQuery extends SelectFromSingleTableQuery<ContentCommit, ContentCommitQuery, ContentCommitSk, ContentCommitId, null> {
    constructor(qb: SelectQueryBuilder<ContentCommit>) {
        super(qb, ContentCommitQuery);
    }

    byContent(id: ContentSk) {
        return new ContentCommitQuery(this.qb.where("contentId = :id", { id }));
    }

    selectRelated() {
        const query = this.qb;
        return mapQuery(query, toRelatedContentCommit);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("content", "content")
            .leftJoinAndSelect("forkedCommit", "forkedCommit")
            .leftJoinAndSelect("committerUser", "committerUser")
        return mapQuery(query, toFocusedContentCommit);
    }
}

export class ContentCommitQueryFromEntity extends SelectQueryFromEntity<ContentCommit> {
    constructor(commit: ContentCommit) {
        super(commit);
    }

    async getRelated() {
        return toRelatedContentCommit(this.raw);
    }
}