import { SelectQueryBuilder } from "typeorm";
import { MaterialSk } from "../../../entities/material/material";
import { MaterialCommit, MaterialCommitId, MaterialCommitSk } from "../../../entities/material/material_commit";
import { toFocusedMaterialCommit, toRelatedMaterialCommit } from "../../../interfaces/material/material_commit";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

export class MaterialCommitQuery extends SelectFromSingleTableQuery<MaterialCommit, MaterialCommitQuery, MaterialCommitSk, MaterialCommitId, null> {
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

export class MaterialCommitQueryFromEntity extends SelectQueryFromEntity<MaterialCommit> {
    constructor(commit: MaterialCommit) {
        super(commit);
    }

    async getRelated() {
        return toRelatedMaterialCommit(this.raw);
    }
}