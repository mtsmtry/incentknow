import * as uuid from "uuid";
import { User, UserDisplayId, UserSk } from "../../../entities/user/User";
import { UserQuery } from "../../queries/user/UserQuery";
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
            email, displayName, passwordHash, certificationToken: uuid.v4()
        });
        user = await this.users.save(user);
        return user;
    }

    async activateUser(certificationToken: string) {
        const user = await this.users.findOne({ certificationToken });
        if (!user) {
            throw new Error("Wrong certification token");
        }
        await this.users.update(user.id, { certificationToken: null });
        return user;
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

    async setUserIcon(userId: UserSk, iconImage: string) {
        await this.users.update(userId, { iconImage });
    }
    async deleteUser(userId: UserSk) {
        await this.users.delete(userId);
    }
}