import { SelectQueryBuilder } from "typeorm";
import { Format, FormatDisplayId, FormatId, FormatSk } from "../../../entities/format/Format";
import { SpaceSk } from "../../../entities/space/Space";
import { Relation, toFocusedFormat, toRelatedFormat } from "../../../interfaces/format/Format";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";
import { joinProperties } from "./StructureQuery";

export class FormatQuery extends SelectFromSingleTableQuery<Format, FormatQuery, FormatSk, FormatId, FormatDisplayId> {
    constructor(qb: SelectQueryBuilder<Format>) {
        super(qb, FormatQuery);
    }

    bySpace(spaceId: SpaceSk) {
        return new FormatQuery(this.qb.where({ spaceId }));
    }

    joinProperties() {
        return new FormatQuery(this.qb.leftJoinAndSelect("x.properties", "allProperties"));
    }

    joinCurrentStructure() {
        let query = this.qb.leftJoinAndSelect("x.currentStructure", "currentStructure");
        query = joinProperties("currentStructure", query);
        return new FormatQuery(query);
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.currentStructure", "currentStructure");

        return mapQuery(query, toRelatedFormat);
    }

    selectFocused() {
        let query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .leftJoinAndSelect("x.currentStructure", "currentStructure");
        let query2 = joinProperties("currentStructure", query);

        return mapQuery(query2, toFocusedFormat);
    }
}

export class FormatQueryFromEntity extends SelectQueryFromEntity<Format> {
    constructor(Format: Format) {
        super(Format);
    }
}