import { User, UserSk } from "../entities/user/user";

export class AuthenticatedService {
    private static _myUserId: UserSk | null;
    private static getUser: (id: UserSk) => Promise<User>;

    get myUserId() {
        return AuthenticatedService._myUserId;
    }

    async getMyUser(): Promise<User> {
        if (!this.myUserId) {
            throw "Not logined";
        }
        return await AuthenticatedService.getUser(this.myUserId);
    }
}