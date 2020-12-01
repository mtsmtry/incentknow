import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/content";
import { Material, MaterialSk } from "../../../entities/material/material";
import { MaterialId, toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/material";
import { RelatedMaterialDraft } from "../../../interfaces/material/material_draft";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

export class MaterialQuery extends SelectFromSingleTableQuery<Material, MaterialQuery, MaterialSk, MaterialId, null> {
    constructor(qb: SelectQueryBuilder<Material>) {
        super(qb, MaterialQuery);
    }

    byContent(contentId: ContentSk) {
        return new MaterialQuery(this.qb.where({ contentId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toRelatedMaterial);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .addSelect("data");

        return mapQuery(query, x => (d: RelatedMaterialDraft) => toFocusedMaterial(x, d));
    }
}

export class MaterialQueryFromEntity extends SelectQueryFromEntity<Material> {
    constructor(material: Material) {
        super(material);
    }
}