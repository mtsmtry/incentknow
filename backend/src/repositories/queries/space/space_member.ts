import { SelectQueryBuilder } from "typeorm";
import { SpaceSk } from "../../../entities/space/space";
import { SpaceMember, SpaceMemberSk } from "../../../entities/space/space_member";
import { UserSk } from "../../../entities/user/user";
import { toIntactSpaceMember } from "../../../interfaces/space/space_member";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class SpaceMemberQuery extends SelectFromSingleTableQuery<SpaceMember, SpaceMemberQuery, SpaceMemberSk, null, null> {
    constructor(qb: SelectQueryBuilder<SpaceMember>) {
        super(qb, SpaceMemberQuery);
    }

    bySpace(spaceId: SpaceSk) {
        const query = this.qb.where({ spaceId });
        return new SpaceMemberQuery(query);
    }
    
    selectIntact() {
        const query = this.qb
            .leftJoinAndSelect("user", "user");

        return mapQuery(query, toIntactSpaceMember);
    }
}