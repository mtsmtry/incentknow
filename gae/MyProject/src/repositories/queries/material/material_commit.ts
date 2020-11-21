import { SelectQueryBuilder } from "typeorm";
import { Material, MaterialSk } from "../../../entities/material/material";
import { MaterialCommit } from "../../../entities/material/material_commit";
import { toFocusedMaterialCommit, toRelatedMaterialCommit } from "../../../interfaces/material/material_commit";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class MaterialCommitQuery extends SelectFromSingleTableQuery<MaterialCommit, MaterialCommitQuery> {
    constructor(qb: SelectQueryBuilder<MaterialCommit>) {
        super(qb, MaterialCommitQuery);
    }

    byMaterial(id: MaterialSk) {
        return new MaterialCommitQuery(this.qb.where("materialId = :id", { id }));
    }

    selectRelated() {
        const query = this.qb;
        return mapQuery(query, toRelatedMaterialCommit);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("material", "material")
            .leftJoinAndSelect("forkedCommit", "forkedCommit")
            .leftJoinAndSelect("committerUser", "committerUser")
        return mapQuery(query, toFocusedMaterialCommit);
    }
}