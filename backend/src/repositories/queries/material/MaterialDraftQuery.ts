import { SelectQueryBuilder } from "typeorm";
import { ContentDraftSk } from "../../../entities/content/ContentDraft";
import { MaterialSk } from "../../../entities/material/Material";
import { MaterialDraft, MaterialDraftId, MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { UserSk } from "../../../entities/user/User";
import { toFocusedMaterialDraft, toRelatedMaterialDraft } from "../../../interfaces/material/MaterialDraft";
import { InternalError } from "../../../services/Errors";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class MaterialDraftQuery extends SelectFromSingleTableQuery<MaterialDraft, MaterialDraftQuery, MaterialDraftSk, MaterialDraftId, null> {
    constructor(qb: SelectQueryBuilder<MaterialDraft>) {
        super(qb, MaterialDraftQuery);
    }

    byUser(userId: UserSk) {
        return new MaterialDraftQuery(this.qb.where({ userId }));
    }

    byUserOwn(userId: UserSk) {
        return new MaterialDraftQuery(this.qb.where({ userId }).andWhere("x.intendedContentDraftId IS NULL AND x.currentEditingId IS NOT NULL"));
    }

    byMaterial(materialId: MaterialSk) {
        return new MaterialDraftQuery(this.qb.where({ materialId }));
    }

    byMaterialAndUser(materialId: MaterialSk, userId: UserSk) {
        return new MaterialDraftQuery(this.qb.where({ materialId, userId }));
    }

    byMaterials(materialIds: MaterialSk[]) {
        return new MaterialDraftQuery(this.qb.where("x.materialId IN (:...ids)", { ids: materialIds }));
    }

    byIntendedContentDraft(intendedContentDraftId: ContentDraftSk) {
        return new MaterialDraftQuery(this.qb.where({ intendedContentDraftId }));
    }

    joinSnapshotAndSelectData() {
        const query = this.qb
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("currentEditing.snapshot", "snapshot")
            .addSelect("snapshot.data");
        return new MaterialDraftQuery(query);
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("currentEditing.snapshot", "snapshot")
            .addSelect("snapshot.data");
        return mapQuery(query, toRelatedMaterialDraft);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.material", "material")
            .leftJoinAndSelect("material.commit", "materialCommit")
            .leftJoinAndSelect("material.creatorUser", "materialCreatorUser")
            .leftJoinAndSelect("material.updaterUser", "materialUpdaterUser")
            .leftJoinAndSelect("x.intendedContentDraft", "intendedContentDraft")
            .leftJoinAndSelect("x.currentEditing", "currentEditing")
            .leftJoinAndSelect("currentEditing.snapshot", "snapshot")
            .addSelect("snapshot.data");

        return mapQuery(query, x => {
            const data = x.currentEditing?.snapshot.data;
            if (!data) {
                throw new InternalError("data is null");
            }
            return toFocusedMaterialDraft(x, data);
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