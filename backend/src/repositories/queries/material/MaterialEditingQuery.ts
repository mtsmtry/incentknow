import { SelectQueryBuilder } from "typeorm";
import { MaterialEditing, MaterialEditingId, MaterialEditingSk } from "../../../entities/material/MaterialEditing";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class MaterialEditingQuery extends SelectFromSingleTableQuery<MaterialEditing, MaterialEditingQuery, MaterialEditingSk, MaterialEditingId, null> {
    constructor(qb: SelectQueryBuilder<MaterialEditing>) {
        super(qb, MaterialEditingQuery);
    }
}