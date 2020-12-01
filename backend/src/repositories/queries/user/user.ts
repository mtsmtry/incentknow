import { SelectQueryBuilder } from "typeorm";
import { User, UserDisplayId, UserId, UserSk } from "../../../entities/user/user";
import { toFocusedUser, toIntactAccount, toRelatedUser } from "../../../interfaces/user/user";
import { mapQuery } from "../mapped_query";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../select_query";

export class UserQuery extends SelectFromSingleTableQuery<User, UserQuery, UserSk, UserId, UserDisplayId> {
    constructor(qb: SelectQueryBuilder<User>) {
        super(qb, UserQuery);
    }

    selectRelated() {
        const query = this.qb;
        return mapQuery(query, toRelatedUser);
    }

    selectFocused() {
        const query = this.qb;
        return mapQuery(query, toFocusedUser);
    }

    selectIntactAccount() {
        const query = this.qb;
        return mapQuery(query, toIntactAccount);
    }
}

export class UserQueryFromEntity extends SelectQueryFromEntity<User> {
    constructor(user: User) {
        super(user);
    }
}