import { SelectQueryBuilder } from "typeorm";
import { SpaceSk } from "../../../entities/space/space";
import { SpaceMembershipApplication, SpaceMembershipApplicationSk } from "../../../entities/space/space_membership_application";
import { UserSk } from "../../../entities/user/user";
import { toIntactSpaceMembershipApplication } from "../../../interfaces/space/space_membership_application";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

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
            .leftJoinAndSelect("user", "user");

        return mapQuery(query, toIntactSpaceMembershipApplication);
    }
}