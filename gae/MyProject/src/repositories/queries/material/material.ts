import { SelectQueryBuilder } from "typeorm";
import { Material } from "../../../entities/material/material";
import { MaterialDraft } from "../../../entities/material/material_draft";
import { MaterialId, toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/material";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class MaterialQuery extends SelectFromSingleTableQuery<Material, MaterialQuery> {
    constructor(qb: SelectQueryBuilder<Material>) {
        super(qb, MaterialQuery);
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toRelatedMaterial);
    }

    selectFocused(draft: MaterialDraft | null) {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .addSelect("data");

        return mapQuery(query, x => toFocusedMaterial(x, draft));
    }
}