import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { Material, MaterialSk } from "../../../entities/material/Material";
import { MaterialId, toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/Material";
import { RelatedMaterialDraft } from "../../../interfaces/material/MaterialDraft";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class MaterialQuery extends SelectFromSingleTableQuery<Material, MaterialQuery, MaterialSk, MaterialId, null> {
    constructor(qb: SelectQueryBuilder<Material>) {
        super(qb, MaterialQuery);
    }

    byContent(contentId: ContentSk) {
        return new MaterialQuery(this.qb.where({ contentId }));
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser");

        return mapQuery(query, toRelatedMaterial);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .leftJoinAndSelect("x.updaterUser", "updaterUser")
            .addSelect("data");

        return mapQuery(query, x => (d: RelatedMaterialDraft) => toFocusedMaterial(x, d));
    }
}

export class MaterialQueryFromEntity extends SelectQueryFromEntity<Material> {
    constructor(material: Material) {
        super(material);
    }
}