
import { UserDisplayId, UserId } from "../../entities/user/User";
import { FocusedUser, IntactAccount, RelatedUser } from "../../interfaces/user/User";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { UserRepository } from '../../repositories/implements/user/UserDto';
import { BaseService } from "../BaseService";
import { PasswordSecurity, SessionSecurity } from "../Security";
import { ServiceContext } from "../ServiceContext";

export class UserService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private users: UserRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    async createUser(email: string, displayName: string, password: string): Promise<UserId> {
        return await this.ctx.transaction(async trx => {
            const passwordHash = PasswordSecurity.getHash(password);
            const user = await this.users.createCommand(trx).createUser(email, displayName, passwordHash);
            return user.raw.entityId;
        });
    }

    async getMyUser(): Promise<FocusedUser> {
        const userId = this.ctx.getAuthorized();
        return await this.users.fromUsers().byId(userId).selectFocused().getNeededOne();
    }

    async getMyAccount(): Promise<IntactAccount> {
        const userId = this.ctx.getAuthorized();
        return await this.users.fromUsers().byId(userId).selectIntactAccount().getNeededOne();
    }

    async getUser(displayId: UserDisplayId): Promise<FocusedUser> {
        return await this.users.fromUsers().byDisplayId(displayId).selectFocused().getNeededOne();
    }

    async authenticate(email: string, password: string): Promise<string> {
        const user = await this.users.fromUsers().byEmail(email).getNeededOne();
        if (!PasswordSecurity.compare(password, user.passwordHash)) {
            throw "Wrong password";
        }
        return SessionSecurity.getToken(user.id);
    }

    async getFocusedUser(userId: UserId): Promise<FocusedUser> {
        return await this.users.fromUsers().byEntityId(userId).selectFocused().getNeededOne();
    }

    async getRelatedUser(userId: UserId): Promise<RelatedUser> {
        return await this.users.fromUsers().byEntityId(userId).selectRelated().getNeededOne();
    }

    async setMyPassword(oldPassword: string, newPassword: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const user = await this.users.fromUsers(trx).byId(userId).getNeededOne();
            if (!PasswordSecurity.compare(oldPassword, user.passwordHash)) {
                throw "Wrong password";
            }
            const passwordHash = PasswordSecurity.getHash(newPassword);
            await this.users.createCommand(trx).setUserPassword(userId, passwordHash);
            return {};
        });
    }

    async setMyDisplayName(displayName: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserDisplayName(userId, displayName);
            return {};
        });
    }

    async setMyDisplayId(displayId: UserDisplayId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserDisplayId(userId, displayId);
            return {};
        });
    }

    async setMyEmail(email: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserEmail(userId, email);
            return {};
        });
    }

    async setMyIcon(icon: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserIcon(userId, icon);
            return {};
        });
    }
}

