import { SelectQueryBuilder } from "typeorm";
import { FormatSk } from "../../../entities/format/Format";
import { Structure, StructureSk } from "../../../entities/format/Structure";
import { Relation, toFocusedFormatFromStructure } from "../../../interfaces/format/Format";
import { StructureId, toRelatedStructure } from "../../../interfaces/format/Structure";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export function joinPropertyArguments<T>(alias: string, query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    const qb = query
        .leftJoinAndSelect(alias + ".metaProperties", "metaProperties")
        .leftJoinAndSelect(alias + ".argFormat", "argFormat")
        .leftJoinAndSelect(alias + ".argProperties", "argProperties")
        .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
        .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
        //.leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
        //.leftJoinAndSelect("argProperties2.argProperties", "argProperties3")
        .leftJoinAndSelect("argFormat.space", "argFormatSpace")
        .leftJoinAndSelect("argFormat.currentStructure", "argFormatCurrentStructure")
        .leftJoinAndSelect("argFormat2.space", "argFormatSpace2")
        .leftJoinAndSelect("argFormat2.currentStructure", "argFormatCurrentStructure2");
    return joinProperties("argFormatCurrentStructure", qb);
}

export function joinProperties<T>(alias: string, query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    query = query.leftJoinAndSelect(alias + ".properties", "properties");
    return joinPropertyArguments("properties", query);
}

export class StructureQuery extends SelectFromSingleTableQuery<Structure, StructureQuery, StructureSk, StructureId, null> {
    constructor(qb: SelectQueryBuilder<Structure>) {
        super(qb, StructureQuery);
    }

    byFormat(formatId: FormatSk) {
        return new StructureQuery(this.qb.where({ formatId }));
    }

    selectPropertiesJoined() {
        return new StructureQuery(joinProperties("x", this.qb));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.format", "format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.currentStructure", "currentStructure");
        return mapQuery(query, toRelatedStructure);
    }

    selectFocusedFormat() {
        let query = this.qb
            .leftJoinAndSelect("x.format", "format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            .leftJoinAndSelect("format.currentStructure", "currentStructure");
        query = joinProperties("x", query);
        return mapQuery(query, x => (relations: Relation[]) => toFocusedFormatFromStructure(x, relations));
    }
}

export class StructureQueryFromEntity extends SelectQueryFromEntity<Structure> {
    constructor(Structure: Structure) {
        super(Structure);
    }
}