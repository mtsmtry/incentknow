import { ContentCommit } from "../../../entities/content/content_commit";
import { ContentDraft } from "../../../entities/content/content_draft";
import { ContentEditing } from "../../../entities/content/content_editing";
import { ContentSnapshot } from "../../../entities/content/content_snapshot";
import { ContentRivisionQuery } from "../../queries/content/content_revision";
import { BaseReadonlyRepository, Repository } from "../../repository";
import { Transaction } from "../../transaction";

export class ContentRevisionRepository implements BaseReadonlyRepository {
    constructor(
        private drafts: Repository<ContentDraft>,
        private editings: Repository<ContentEditing>,
        private snapshots: Repository<ContentSnapshot>,
        private commits: Repository<ContentCommit>) {
    }

    fromRevisions(trx?: Transaction) {
        return new ContentRivisionQuery(
            this.drafts.createQuery(trx),
            this.editings.createQuery(trx),
            this.snapshots.createQuery(trx),
            this.commits.createQuery(trx));
    }
}