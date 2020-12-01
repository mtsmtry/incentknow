import { User, UserSk } from "../entities/user/user";
import { Transaction } from "../repositories/transaction";
import { BaseService } from "./base_service";

export class AuthenticatedService extends BaseService {
    private static _myUserId: UserSk | null;
    private static getUser: (id: UserSk) => Promise<User>;

    get myUserId() {
        return AuthenticatedService._myUserId;
    }

    async getMyUser(): Promise<User> {
        if (!this.myUserId) {
            throw new LackOfAuthority();
        }
        return await AuthenticatedService.getUser(this.myUserId);
    }

    transactionAuthorized<T>(fun: (trx: Transaction, userId: UserSk) => Promise<T>): Promise<T> {

    }

    authorized<T>(fun: (userId: UserSk) => Promise<T>): Promise<T> {

    }

    getAuthorized() {
        if (!this.myUserId) {
            throw new LackOfAuthority();
        }
        return this.myUserId;
    }
}