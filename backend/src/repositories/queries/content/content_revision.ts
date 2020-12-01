import { SelectQueryBuilder } from "typeorm";
import { ContentCommit } from "../../../entities/content/content_commit";
import { ContentDraft } from "../../../entities/content/content_draft";
import { ContentEditing } from "../../../entities/content/content_editing";
import { ContentSnapshot } from "../../../entities/content/content_snapshot";
import { ContentRevisionId, ContentRevisionSource, toContentRevisionStructure, toFocusedContentRevisionFromCommit, toFocusedContentRevisionFromDraft, toFocusedContentRevisionFromSnapshot } from "../../../interfaces/content/content_revision";
import { FocusedMaterialRevision } from "../../../interfaces/material/material_revision";

/*
    1. 全てのコンテンツのRivisionを取得する
    2. コンテンツの各Rivisionが内包するMaterialのそのコンテンツのRivisionのTimestamp以前のRivisionを取得する
    3. 両者を時系列で統合する
*/

export class ContentRivisionQuery {
    constructor(
        private drafts: SelectQueryBuilder<ContentDraft>,
        private editing: SelectQueryBuilder<ContentEditing>,
        private snapshots: SelectQueryBuilder<ContentSnapshot>,
        private commits: SelectQueryBuilder<ContentCommit>) {
    }

    async getFocusedOneById(src: ContentRevisionId) {
        const strc = toContentRevisionStructure(src);
        switch (strc.source) {
            case ContentRevisionSource.SNAPSHOT:
                const snapshot = await this.snapshots.where({ entityId: strc.entityId }).addSelect("data").getOne();
                return snapshot ? (m: FocusedMaterialRevision[]) => toFocusedContentRevisionFromSnapshot(snapshot, m) : null;
            case ContentRevisionSource.COMMIT:
                const commit = await this.commits.where({ entityId: strc.entityId }).addSelect("data").getOne();
                return commit ? (m: FocusedMaterialRevision[]) => toFocusedContentRevisionFromCommit(commit, m) : null;
            case ContentRevisionSource.DRAFT:
                const draft = await this.drafts.where({ entityId: strc.entityId }).addSelect("data").getOne();
                const data = draft?.data;
                return draft && data ? (m: FocusedMaterialRevision[]) => toFocusedContentRevisionFromDraft(draft, data, m) : null;
        }
    }
}