import { SelectQueryBuilder } from "typeorm";
import { Space, SpaceDisplayId, SpaceId, SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { toFocusedSpace, toRelatedSpace } from "../../../interfaces/space/Space";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class SpaceQuery extends SelectFromSingleTableQuery<Space, SpaceQuery, SpaceSk, SpaceId, SpaceDisplayId> {
    constructor(qb: SelectQueryBuilder<Space>) {
        super(qb, SpaceQuery);
    }

    byFollower(userId: UserSk) {
        const query = this.qb.leftJoin("followers", "f").where("f.id = :userId", { userId });
        return new SpaceQuery(query); 
    }

    byPublished() {
        const query = this.qb.where({ published: true });
        return new SpaceQuery(query); 
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toRelatedSpace);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");

        return mapQuery(query, toFocusedSpace);
    }
}

export class SpaceQueryFromEntity extends SelectQueryFromEntity<Space> {
    constructor(material: Space) {
        super(material);
    }
}