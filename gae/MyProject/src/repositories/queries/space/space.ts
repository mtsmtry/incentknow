import { SelectQueryBuilder } from "typeorm";
import { Material } from "../../../entities/material/material";
import { MaterialDraft } from "../../../entities/material/material_draft";
import { Space } from "../../../entities/space/space";
import { MaterialId, toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/material";
import { toFocusedSpace, toRelatedSpace } from "../../../interfaces/space/space";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class SpaceQuery extends SelectFromSingleTableQuery<Space, SpaceQuery> {
    constructor(qb: SelectQueryBuilder<Space>) {
        super(qb, SpaceQuery);
    }

    getRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toRelatedSpace);
    }

    getFocused(draft: MaterialDraft | null) {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toFocusedSpace);
    }
}