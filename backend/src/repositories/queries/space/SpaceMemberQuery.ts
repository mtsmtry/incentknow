import { SelectQueryBuilder } from "typeorm";
import { SpaceSk } from "../../../entities/space/Space";
import { SpaceMember, SpaceMemberSk } from "../../../entities/space/SpaceMember";
import { UserSk } from "../../../entities/user/User";
import { toIntactSpaceMember } from "../../../interfaces/space/SpaceMember";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class SpaceMemberQuery extends SelectFromSingleTableQuery<SpaceMember, SpaceMemberQuery, SpaceMemberSk, null, null> {
    constructor(qb: SelectQueryBuilder<SpaceMember>) {
        super(qb, SpaceMemberQuery);
    }

    bySpace(spaceId: SpaceSk) {
        const query = this.qb.where({ spaceId });
        return new SpaceMemberQuery(query);
    }

    byUser(userId: UserSk) {
        const query = this.qb.where({ userId });
        return new SpaceMemberQuery(query);
    }

    selectIntact() {
        const query = this.qb
            .leftJoinAndSelect("x.user", "user");

        return mapQuery(query, toIntactSpaceMember);
    }
}