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
        //.leftJoinAndSelect("argProperties.argFormat", "argFormat2")
        //.leftJoinAndSelect("argProperties.argProperties", "argProperties2")
        //.leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
        //.leftJoinAndSelect("argProperties2.argProperties", "argProperties3")

        .leftJoinAndSelect("argFormat.space", "argFormatSpace")
        .leftJoinAndSelect("argFormat.creatorUser", "creatorUser2")
        .leftJoinAndSelect("argFormat.updaterUser", "updaterUser2")
        .leftJoinAndSelect("argFormat.currentStructure", "currentStructure2")
        .leftJoinAndSelect("currentStructure2.properties", "properties2")
        .leftJoinAndSelect("properties2.metaProperties", "metaProperties2")
        // .leftJoinAndSelect("properties2.argFormat", "argFormat")
        //.leftJoinAndSelect("properties2.argProperties", "argProperties2");
        ;
    return qb;
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

    byFormatAndVersion(formatId: FormatSk, version: number) {
        return new StructureQuery(this.qb.where({ formatId, version }));
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
            .leftJoinAndSelect("format.currentStructure", "currentStructure")
            .leftJoinAndSelect("format.semanticId", "semanticId");;
        query = joinProperties("x", query);
        return mapQuery(query, toFocusedFormatFromStructure);
    }
}

export class StructureQueryFromEntity extends SelectQueryFromEntity<Structure> {
    constructor(Structure: Structure) {
        super(Structure);
    }
}