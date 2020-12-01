import { SelectQueryBuilder } from "typeorm";
import { ContentDraftSk } from "../../../entities/content/content_draft";
import { MaterialSk } from "../../../entities/material/material";
import { MaterialDraft, MaterialDraftId, MaterialDraftSk } from "../../../entities/material/material_draft";
import { UserSk } from "../../../entities/user/user";
import { RelatedMaterial } from "../../../interfaces/material/material";
import { toFocusedMaterialDraft, toRelatedMaterialDraft } from "../../../interfaces/material/material_draft";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

export class MaterialDraftQuery extends SelectFromSingleTableQuery<MaterialDraft, MaterialDraftQuery, MaterialDraftSk, MaterialDraftId, null> {
    constructor(qb: SelectQueryBuilder<MaterialDraft>) {
        super(qb, MaterialDraftQuery);
    }

    byUser(userId: UserSk) {
        return new MaterialDraftQuery(this.qb.where({ userId }));
    }

    byMaterial(materialId: MaterialSk) {
        return new MaterialDraftQuery(this.qb.where({ materialId }));
    }

    byMaterials(materialIds: MaterialSk[]) {
        return new MaterialDraftQuery(this.qb.where("x.materialId IN (:...ids)", { ids: materialIds }));
    }

    byIntendedContentDraft(intendedContentDraftId: ContentDraftSk) {
        return new MaterialDraftQuery(this.qb.where({ intendedContentDraftId }));
    }

    selectRelated() {
        const query = this.qb;
        return mapQuery(query, toRelatedMaterialDraft);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("material", "material")
            .leftJoinAndSelect("intendedContentDraft", "intendedContentDraft")

        return mapQuery(query, x => {
            const data = x.data;
            return data ? (m: RelatedMaterial | null) => toFocusedMaterialDraft(x, data, m) : null;
        });
    }
}

export class MaterialDraftQueryFromEntity extends SelectQueryFromEntity<MaterialDraft> {
    constructor(draft: MaterialDraft) {
        super(draft);
    }

    async getRelated() {
        return toRelatedMaterialDraft(this.raw);
    }
}