import { SelectQueryBuilder } from "typeorm";
import { Material, MaterialSk } from "../../../entities/material/material";
import { MaterialDraft } from "../../../entities/material/material_draft";
import { User, UserSk } from "../../../entities/user/user";
import { toFocusedMaterialDraft, toRelatedMaterialDraft } from "../../../interfaces/material/material_draft";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class MaterialDraftQuery extends SelectFromSingleTableQuery<MaterialDraft, MaterialDraftQuery> {
    constructor(qb: SelectQueryBuilder<MaterialDraft>) {
        super(qb, MaterialDraftQuery);
    }

    byUser(id: UserSk) {
        return new MaterialDraftQuery(this.qb.where("userId = :id", { id }));
    }

    byMaterial(id: MaterialSk) {
        return new MaterialDraftQuery(this.qb.where("materialId = :id", { id }));
    }

    selectRelated() {
        const query = this.qb;
        return mapQuery(query, toRelatedMaterialDraft);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("material", "material")
            .leftJoinAndSelect("intendedContentDraft", "intendedContentDraft")

        return mapQuery(query, toFocusedMaterialDraft);
    }
}