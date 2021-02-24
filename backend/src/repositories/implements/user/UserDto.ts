import { User, UserDisplayId, UserSk } from "../../../entities/user/User";
import { UserQuery, UserQueryFromEntity } from "../../queries/user/UserQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class UserRepository implements BaseRepository<UserCommand> {
    constructor(
        private users: Repository<User>) {
    }

    fromUsers(trx?: Transaction) {
        return new UserQuery(this.users.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new UserCommand(this.users.createCommand(trx));
    }
}

export class UserCommand implements BaseCommand {
    constructor(
        private users: Command<User>) {
    }

    async createUser(email: string, displayName: string, passwordHash: string) {
        let user = this.users.create({
            email, displayName, passwordHash
        });
        user = await this.users.save(user);
        return new UserQueryFromEntity(user);
    }

    async setUserDisplayName(userId: UserSk, displayName: string) {
        await this.users.update(userId, { displayName });
    }

    async setUserDisplayId(userId: UserSk, displayId: UserDisplayId) {
        await this.users.update(userId, { displayId });
    }

    async setUserPassword(userId: UserSk, passwordHash: string) {
        await this.users.update(userId, { passwordHash });
    }

    async setUserEmail(userId: UserSk, email: string) {
        await this.users.update(userId, { email });
    }

    async setUserIcon(userId: UserSk, iconUrl: string) {
        await this.users.update(userId, { iconUrl });
    }
}