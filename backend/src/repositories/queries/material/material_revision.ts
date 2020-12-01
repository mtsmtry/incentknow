import { SelectQueryBuilder } from "typeorm";
import { MaterialCommit } from "../../../entities/material/material_commit";
import { MaterialDraft } from "../../../entities/material/material_draft";
import { MaterialEditing } from "../../../entities/material/material_editing";
import { MaterialSnapshot } from "../../../entities/material/material_snapshot";
import { MaterialRevisionId, MaterialRevisionSource, toFocusedMaterialRevisionFromCommit, toFocusedMaterialRevisionFromDraft, toFocusedMaterialRevisionFromSnapshot, toMaterialRevisionStructure } from "../../../interfaces/material/material_revision";

export class MaterialRivisionQuery {
    constructor(
        private drafts: SelectQueryBuilder<MaterialDraft>,
        private editing: SelectQueryBuilder<MaterialEditing>,
        private snapshots: SelectQueryBuilder<MaterialSnapshot>,
        private commits: SelectQueryBuilder<MaterialCommit>) {
    }

    async getFocusedOneById(id: MaterialRevisionId) {
        const strc = toMaterialRevisionStructure(id);
        switch (strc.source) {
            case MaterialRevisionSource.SNAPSHOT:
                const snapshot = await this.snapshots.where({ entityId: strc.entityId }).addSelect("data").getOne();
                return snapshot ? toFocusedMaterialRevisionFromSnapshot(snapshot) : null;
            case MaterialRevisionSource.COMMIT:
                const commit = await this.commits.where({ entityId: strc.entityId }).addSelect("data").getOne();
                return commit ? toFocusedMaterialRevisionFromCommit(commit) : null;
            case MaterialRevisionSource.DRAFT:
                const draft = await this.drafts.where({ entityId: strc.entityId }).addSelect("data").getOne();
                return draft && draft.data ? toFocusedMaterialRevisionFromDraft(draft, draft.data) : null;
        }
    }
}