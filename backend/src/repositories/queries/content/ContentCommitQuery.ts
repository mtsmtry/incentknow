import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentCommit, ContentCommitId, ContentCommitSk } from "../../../entities/content/ContentCommit";
import { toFocusedContentCommit, toRelatedContentCommit } from "../../../interfaces/content/ContentCommit";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class ContentCommitQuery extends SelectFromSingleTableQuery<ContentCommit, ContentCommitQuery, ContentCommitSk, ContentCommitId, null> {
    constructor(qb: SelectQueryBuilder<ContentCommit>) {
        super(qb, ContentCommitQuery);
    }

    byContent(contentId: ContentSk) {
        return new ContentCommitQuery(this.qb.where({ contentId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.content", "content");
        return mapQuery(query, toRelatedContentCommit);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.content", "content")
            .leftJoinAndSelect("x.committerUser", "committerUser")
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