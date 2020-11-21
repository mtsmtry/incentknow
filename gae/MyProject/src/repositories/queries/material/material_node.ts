import { SelectQueryBuilder } from "typeorm";
import { MaterialCommit } from "../../../entities/material/material_commit";
import { MaterialDraft, MaterialDraftSk } from "../../../entities/material/material_draft";
import { MaterialEditing } from "../../../entities/material/material_editing";
import { MaterialSnapshot } from "../../../entities/material/material_snapshot";
import { toFocusedMaterialDraft, toRelatedMaterialDraft } from "../../../interfaces/material/material_draft";
import { toMaterialNodes } from "../../../interfaces/material/material_node";

export class MaterialNodeQuery {
    constructor(
        private commits: SelectQueryBuilder<MaterialCommit>,
        private editings: SelectQueryBuilder<MaterialEditing>) {
    }

    async getManyByDraft(id: MaterialDraftSk) {
        const [editings, commits] = await Promise.all([
            this.editings.where("draftId = :id", { id }).getMany(),
            this.commits.where("draftId = :id", { id }).getMany()]);
        
        return toMaterialNodes(editings, commits);
    }
}