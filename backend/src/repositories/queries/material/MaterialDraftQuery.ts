import { SelectQueryBuilder } from "typeorm";
import { ContentDraftSk } from "../../../entities/content/ContentDraft";
import { MaterialSk } from "../../../entities/material/Material";
import { MaterialDraft, MaterialDraftId, MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { UserSk } from "../../../entities/user/User";
import { RelatedMaterial } from "../../../interfaces/material/Material";
import { toFocusedMaterialDraft, toRelatedMaterialDraft } from "../../../interfaces/material/MaterialDraft";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

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