import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/content";
import { Structure, StructureSk } from "../../../entities/format/structure";
import { toFocusedFormatFromStructure } from "../../../interfaces/format/format";
import { StructureId } from "../../../interfaces/format/structure";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

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

    byContent(contentId: ContentSk) {
        return new StructureQuery(this.qb.where({ contentId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return null; // mapQuery(query, toRelatedF);
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