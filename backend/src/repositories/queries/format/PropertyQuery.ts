import { SelectQueryBuilder } from "typeorm";
import { FormatSk } from "../../../entities/format/Format";
import { Property, PropertyId, PropertySk } from "../../../entities/format/Property";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class PropertyQuery extends SelectFromSingleTableQuery<Property, PropertyQuery, PropertySk, PropertyId, string> {
    constructor(qb: SelectQueryBuilder<Property>) {
        super(qb, PropertyQuery);
    }

    byFormat(formatId: FormatSk) {
        return new PropertyQuery(this.qb.where({ formatId }));
    }
}