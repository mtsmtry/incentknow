import { SelectQueryBuilder } from "typeorm";
import { ContentDraftSk } from "../../../entities/content/ContentDraft";
import { MaterialSk } from "../../../entities/material/Material";
import { MaterialDraft, MaterialDraftId, MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { MaterialSnapshot, MaterialSnapshotId, MaterialSnapshotSk } from "../../../entities/material/MaterialSnapshot";
import { UserSk } from "../../../entities/user/User";
import { toFocusedMaterialDraft, toRelatedMaterialDraft } from "../../../interfaces/material/MaterialDraft";
import { toFocusedMaterialSnapshot, toRelatedMaterialSnapshot } from "../../../interfaces/material/MaterialSnapshot";
import { InternalError } from "../../../services/Errors";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class MaterialSnapshotQuery extends SelectFromSingleTableQuery<MaterialSnapshot, MaterialSnapshotQuery, MaterialSnapshotSk, MaterialSnapshotId, null> {
    constructor(qb: SelectQueryBuilder<MaterialSnapshot>) {
        super(qb, MaterialSnapshotQuery);
    }

    selectRelated() {
        return mapQuery(this.qb, toRelatedMaterialSnapshot);
    }

    selectFocused() {
        const query = this.qb.addSelect("x.data");
        return mapQuery(query, toFocusedMaterialSnapshot);
    }
}