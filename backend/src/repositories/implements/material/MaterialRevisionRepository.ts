import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { MaterialDraft } from "../../../entities/material/MaterialDraft";
import { MaterialEditing } from "../../../entities/material/MaterialEditing";
import { MaterialSnapshot } from "../../../entities/material/MaterialSnapshot";
import { MaterialNodeQuery } from "../../queries/material/MaterialNodeQuery";
import { MaterialRivisionQuery } from "../../queries/material/MaterialRevisionQuery";
import { BaseReadonlyRepository, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class MaterialRevisionRepository implements BaseReadonlyRepository {
    constructor(
        private drafts: Repository<MaterialDraft>,
        private editings: Repository<MaterialEditing>,
        private snapshots: Repository<MaterialSnapshot>,
        private commits: Repository<MaterialCommit>) {
    }

    fromNodes(trx?: Transaction) {
        return new MaterialNodeQuery(
            this.commits.createQuery(trx),
            this.editings.createQuery(trx));
    }

    fromRevisions(trx?: Transaction) {
        return new MaterialRivisionQuery(
            this.drafts.createQuery(trx),
            this.editings.createQuery(trx),
            this.snapshots.createQuery(trx),
            this.commits.createQuery(trx));
    }
}