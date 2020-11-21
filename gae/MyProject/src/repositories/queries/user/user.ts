import { SelectQueryBuilder } from "typeorm";
import { Material } from "../../../entities/material/material";
import { MaterialDraft } from "../../../entities/material/material_draft";
import { Space } from "../../../entities/space/space";
import { User } from "../../../entities/user/user";
import { MaterialId, toFocusedMaterial, toRelatedMaterial } from "../../../interfaces/material/material";
import { toFocusedSpace, toRelatedSpace } from "../../../interfaces/space/space";
import { toFocusedUser, toRelatedUser } from "../../../interfaces/user/user";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class UserQuery extends SelectFromSingleTableQuery<User, UserQuery> {
    constructor(qb: SelectQueryBuilder<User>) {
        super(qb, UserQuery);
    }

    getRelated() {
        const query = this.qb;
        return mapQuery(query, toRelatedUser);
    }

    getFocused() {
        const query = this.qb;
        return mapQuery(query, toFocusedUser);
    }
}