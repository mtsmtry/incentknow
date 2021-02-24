import { SelectQueryBuilder } from "typeorm";
import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { MaterialEditing } from "../../../entities/material/MaterialEditing";
import { toMaterialNodes } from "../../../interfaces/material/MaterialNode";

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