import { Repository } from "typeorm";
import { MaterialCommit } from "../entities/material/material_commit";
import { MaterialDraft } from "../entities/material/material_draft";
import { MaterialEditing } from "../entities/material/material_editing";
import { MaterialSnapshot } from "../entities/material/material_snapshot";
import { MaterialNodeQuery } from "./queries/material/material_node";
import { MaterialRivisionQuery } from "./queries/material/material_revision";

export class MaterialRevisionRepository {
    constructor(
        private drafts: Repository<MaterialDraft>,
        private editings: Repository<MaterialEditing>,
        private snapshots: Repository<MaterialSnapshot>,
        private commits: Repository<MaterialCommit>) {
    }

    fromNodes() {
        return new MaterialNodeQuery(
            this.commits.createQueryBuilder("x"), 
            this.editings.createQueryBuilder("x"));
    }

    fromRevisions() {
        return new MaterialRivisionQuery(
            this.drafts.createQueryBuilder("x"),
            this.editings.createQueryBuilder("x"),
            this.snapshots.createQueryBuilder("x"),
            this.commits.createQueryBuilder("x"));
    }
}