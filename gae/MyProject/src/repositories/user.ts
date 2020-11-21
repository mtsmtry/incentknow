import { Repository } from "typeorm";
import { User } from "../entities/user/user";
import { UserQuery } from "./queries/user/user";

export class UserRepository {
    constructor(
        private users: Repository<User>) {
    }

    fromUsers() {
        return new UserQuery(this.users.createQueryBuilder("x"));
    }
}