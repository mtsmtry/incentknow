import { SelectQueryBuilder } from "typeorm";
import { Format, FormatDisplayId, FormatId, FormatSk } from "../../../entities/format/format";
import { SpaceSk } from "../../../entities/space/space";
import { toFocusedFormat, toRelatedFormat } from "../../../interfaces/format/format";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";
import { joinProperties } from "./structure";

export class FormatQuery extends SelectFromSingleTableQuery<Format, FormatQuery, FormatSk, FormatId, FormatDisplayId> {
    constructor(qb: SelectQueryBuilder<Format>) {
        super(qb, FormatQuery);
    }

    bySpace(spaceId: SpaceSk) {
        return new FormatQuery(this.qb.where({ spaceId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toRelatedFormat);
    }

    selectFocused() {
        let query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .leftJoinAndSelect("currentStructure", "currentStructure");
        let query2 = joinProperties("currentStructure", query);

        return mapQuery(query2, toFocusedFormat);
    }
}

export class FormatQueryFromEntity extends SelectQueryFromEntity<Format> {
    constructor(Format: Format) {
        super(Format);
    }
}