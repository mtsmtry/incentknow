import { SelectQueryBuilder } from "typeorm";
import { User, UserDisplayId, UserId, UserSk } from "../../../entities/user/User";
import { toFocusedUser, toIntactAccount, toRelatedUser } from "../../../interfaces/user/User";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery, SelectQueryFromEntity } from "../SelectQuery";

export class UserQuery extends SelectFromSingleTableQuery<User, UserQuery, UserSk, UserId, UserDisplayId> {
    constructor(qb: SelectQueryBuilder<User>) {
        super(qb, UserQuery);
    }

    byEmail(email: string) {
        const query = this.qb.where({ email });
        return new UserQuery(query);
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

    authenticate() {
        
    }
}

export class UserQueryFromEntity extends SelectQueryFromEntity<User> {
    constructor(user: User) {
        super(user);
    }
}