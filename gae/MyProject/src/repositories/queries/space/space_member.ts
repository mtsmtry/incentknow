import { SelectQueryBuilder } from "typeorm";
import { Space, SpaceSk } from "../../../entities/space/space";
import { SpaceMember } from "../../../entities/space/space_member";
import { toIntactSpaceMember } from "../../../interfaces/space/space_member";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery } from "../select_query";

export class SpaceMemberQuery extends SelectFromSingleTableQuery<SpaceMember, SpaceMemberQuery> {
    constructor(qb: SelectQueryBuilder<SpaceMember>) {
        super(qb, SpaceMemberQuery);
    }

    bySpace(id: SpaceSk) {
        const query = this.qb.where("spaceId = :id", { id });
        return new SpaceMemberQuery(query);
    }

    selectIntact() {
        const query = this.qb
            .leftJoinAndSelect("user", "user");

        return mapQuery(query, toIntactSpaceMember);
    }
}