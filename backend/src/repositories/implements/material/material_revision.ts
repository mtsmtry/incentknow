import { MaterialCommit } from "../../../entities/material/material_commit";
import { MaterialDraft } from "../../../entities/material/material_draft";
import { MaterialEditing } from "../../../entities/material/material_editing";
import { MaterialSnapshot } from "../../../entities/material/material_snapshot";
import { MaterialNodeQuery } from "../../queries/material/material_node";
import { MaterialRivisionQuery } from "../../queries/material/material_revision";
import { BaseReadonlyRepository, Repository } from "../../repository";
import { Transaction } from "../../transaction";

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