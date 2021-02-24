import { ContentCommit } from "../../../entities/content/ContentCommit";
import { ContentDraft } from "../../../entities/content/ContentDraft";
import { ContentEditing } from "../../../entities/content/ContentEditing";
import { ContentSnapshot } from "../../../entities/content/ContentSnapshot";
import { ContentRivisionQuery } from "../../queries/content/ContentRevisionQuery";
import { BaseReadonlyRepository, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

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