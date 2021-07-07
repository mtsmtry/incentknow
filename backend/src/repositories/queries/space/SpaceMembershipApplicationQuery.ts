import { SelectQueryBuilder } from "typeorm";
import { SpaceSk } from "../../../entities/space/Space";
import { SpaceMembershipApplication, SpaceMembershipApplicationSk } from "../../../entities/space/SpaceMembershipApplication";
import { UserSk } from "../../../entities/user/User";
import { toIntactSpaceMembershipApplication } from "../../../interfaces/space/SpaceMembershipApplication";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class SpaceMemberApplicationQuery extends SelectFromSingleTableQuery<SpaceMembershipApplication, SpaceMemberApplicationQuery, SpaceMembershipApplicationSk, null, null> {
    constructor(qb: SelectQueryBuilder<SpaceMembershipApplication>) {
        super(qb, SpaceMemberApplicationQuery);
    }

    bySpace(spaceId: SpaceSk) {
        const query = this.qb.where({ spaceId });
        return new SpaceMemberApplicationQuery(query);
    }

    byUser(userId: UserSk) {
        const query = this.qb.where({ userId });
        return new SpaceMemberApplicationQuery(query);
    }

    selectIntact() {
        const query = this.qb
            .leftJoinAndSelect("x.user", "user");

        return mapQuery(query, toIntactSpaceMembershipApplication);
    }
}