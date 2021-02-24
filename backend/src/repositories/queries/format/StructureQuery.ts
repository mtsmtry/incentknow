import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { FormatSk } from "../../../entities/format/Format";
import { Structure, StructureSk } from "../../../entities/format/Structure";
import { toFocusedFormatFromStructure } from "../../../interfaces/format/Format";
import { StructureId, toRelatedStructure } from "../../../interfaces/format/Structure";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export function joinProperties<T>(alias: string, query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    return query
        .leftJoinAndSelect(alias + ".properties", "properties")
        .leftJoinAndSelect("properties.argFormat", "argFormat")
        .leftJoinAndSelect("properties.argProperties", "argProperties")
        .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
        .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
        .leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
        .leftJoinAndSelect("argProperties2.argProperties", "argProperties3");
}

export class StructureQuery extends SelectFromSingleTableQuery<Structure, StructureQuery, StructureSk, StructureId, null> {
    constructor(qb: SelectQueryBuilder<Structure>) {
        super(qb, StructureQuery);
    }

    byFormat(formatId: FormatSk) {
        return new StructureQuery(this.qb.where({ formatId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toRelatedStructure);
    }

    selectFocusedFormat() {
        let query = this.qb
            .leftJoinAndSelect("structure.format", "format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser");
        query = joinProperties("x", query);
        return mapQuery(query, toFocusedFormatFromStructure);
    }
}

export class StructureQueryFromEntity extends SelectQueryFromEntity<Structure> {
    constructor(Structure: Structure) {
        super(Structure);
    }
}