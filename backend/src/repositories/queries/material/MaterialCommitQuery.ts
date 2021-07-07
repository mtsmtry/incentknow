import { SelectQueryBuilder } from "typeorm";
import { MaterialSk } from "../../../entities/material/Material";
import { MaterialCommit, MaterialCommitId, MaterialCommitSk } from "../../../entities/material/MaterialCommit";
import { toFocusedMaterialCommit, toRelatedMaterialCommit } from "../../../interfaces/material/MaterialCommit";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

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
            .leftJoinAndSelect("x.material", "material")
            .leftJoinAndSelect("x.basedCommit", "basedCommit")
            .leftJoinAndSelect("x.committerUser", "committerUser")
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