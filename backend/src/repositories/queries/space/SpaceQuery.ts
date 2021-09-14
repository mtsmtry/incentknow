import { SelectQueryBuilder } from "typeorm";
import { Space, SpaceDisplayId, SpaceId, SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { RelatedContainer } from "../../../interfaces/container/Container";
import { AdditionalSpaceInfo, toFocusedSpace, toRelatedSpace } from "../../../interfaces/space/Space";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class SpaceQuery extends SelectFromSingleTableQuery<Space, SpaceQuery, SpaceSk, SpaceId, SpaceDisplayId> {
    constructor(qb: SelectQueryBuilder<Space>) {
        super(qb, SpaceQuery);
    }

    byFollower(userId: UserSk) {
        const query = this.qb.leftJoin("x.followers", "f").where("f.userId = :userId", { userId });
        return new SpaceQuery(query);
    }

    byPublished() {
        const query = this.qb.where({ published: true });
        return new SpaceQuery(query);
    }

    byMember(userId: UserSk) {
        const query = this.qb.leftJoin("x.members", "m").where("m.userId = :userId", { userId });
        return new SpaceQuery(query);
    }

    selectRelated() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
        return mapQuery(query, toRelatedSpace);
    }

    selectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.creatorUser", "creatorUser")
            .addSelect("(SELECT COUNT(*) FROM container WHERE spaceId = x.id)", "containerCount")
            .addSelect("(SELECT COUNT(*) FROM space_member WHERE spaceId = x.id)", "memberCount")
            .addSelect("(SELECT COUNT(*) FROM format WHERE spaceId = x.id)", "formatCount")
            .addSelect("(SELECT COUNT(*) FROM content as c INNER JOIN container as con ON c.containerId = con.id WHERE con.spaceId = x.id)", "contentCount");
        return mapQuery(query, (x, raw) => (c: RelatedContainer[]) => toFocusedSpace(x, raw as AdditionalSpaceInfo, c));
    }
}

export class SpaceQueryFromEntity extends SelectQueryFromEntity<Space> {
    constructor(material: Space) {
        super(material);
    }
}