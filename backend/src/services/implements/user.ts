import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserDisplayId, UserId } from "../../entities/user/user";
import { FocusedUser, RelatedUser } from "../../interfaces/user/user";
import { AuthorityRepository } from "../../repositories/implements/space/authority";
import { UserRepository } from '../../repositories/implements/user/user';
import { AuthenticatedService } from "../authenticated_service";

export class UserService extends AuthenticatedService {
    static jwtSecret = "9099c62b375547b7b34a4485c033bd7eef28a26b928343cb9661da4dbf5482da";

    constructor(
        private users: UserRepository,
        private auth: AuthorityRepository) {
        super();
    }

    async createUser(email: string, displayName: string, password: string): Promise<{}> {
        const passwordHash = bcrypt.hashSync(password, 10);
        await this.users.createCommand(trx).createUser(email, displayName, passwordHash);
        return {};
    }

    async getMyUser(): Promise<FocusedUser> {
        const userId = this.getAuthorized();
        return await this.users.fromUsers().byId(userId).selectFocused().getNeededOne();
    }

    async getMyAccount(): Promise<IntactAccount> {
        const userId = this.getAuthorized();
        return await this.users.fromUsers().byId(userId).selectIntactAccount().getNeededOne();
    }

    async getUser(displayId: UserDisplayId): Promise<FocusedUser> {
        return await this.users.fromUsers().byDisplayId(displayId).selectFocused().getNeededOne();
    }

    async authenticate(email: string, password: string): Promise<string> {
        const user = await User.findOne({ email: email });
        if (!bcrypt.compareSync(password, user.passwordHash)) {
            throw "Wrong password";
        }
        return jwt.sign(user.id.toString(), UserService.jwtSecret);
    }

    _verfyToken(token: string): number {
        return parseInt(jwt.verify(token, UserService.jwtSecret) as string);
    }

    async getFocusedUser(userId: UserId): Promise<FocusedUser> {
        return await this.users.fromUsers().byEntityId(userId).selectFocused().getNeededOne();
    }

    async getRelatedUser(userId: UserId): Promise<RelatedUser> {
        return await this.users.fromUsers().byEntityId(userId).selectRelated().getNeededOne();
    }

    async setMyPassword(oldPassword: string, newPassword: string): Promise<{}> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const user = await super.getMyUser();
            if (!bcrypt.compareSync(oldPassword, user.passwordHash)) {
                throw "Wrong password";
            }
            const passwordHash = bcrypt.hashSync(newPassword, UserService.jwtSecret);
            await this.users.createCommand(trx).setUserPassword(userId, passwordHash);
            return {};
        });
    }

    async setMyDisplayName(displayName: string): Promise<{}> {
        return await this.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserDisplayName(userId, displayName);
            return {};
        });
    }

    async setMyDisplayId(displayId: UserDisplayId): Promise<{}> {
        return await this.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserDisplayId(userId, displayId);
            return {};
        });
    }

    async setMyEmail(email: string): Promise<{}> {
        return await this.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserEmail(userId, email);
            return {};
        });
    }

    async setMyIcon(icon: string): Promise<{}> {
        return await this.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserIcon(userId, icon);
            return {};
        });
    }
}

