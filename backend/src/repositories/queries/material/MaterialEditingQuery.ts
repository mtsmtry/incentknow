import { SelectQueryBuilder } from "typeorm";
import { MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { MaterialEditing, MaterialEditingId, MaterialEditingSk } from "../../../entities/material/MaterialEditing";
import { toIntactMaterialEditing } from "../../../interfaces/material/MaterialEditing";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class MaterialEditingQuery extends SelectFromSingleTableQuery<MaterialEditing, MaterialEditingQuery, MaterialEditingSk, MaterialEditingId, null> {
    constructor(qb: SelectQueryBuilder<MaterialEditing>) {
        super(qb, MaterialEditingQuery);
    }

    byDraft(draftId: MaterialDraftSk) {
        return new MaterialEditingQuery(this.qb.where({ draftId }));
    }

    joinSnapshot() {
        return new MaterialEditingQuery(this.qb.leftJoinAndSelect("x.snapshot", "snapshot"))
    }

    selectIntact() {
        return mapQuery(this.qb, toIntactMaterialEditing);
    }
}