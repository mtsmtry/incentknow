import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { isString } from "util";
import { UserSk } from "../entities/user/User";

export class SessionSecurity {
    static jwtSecret = "9099c62b375547b7b34a4485c033bd7eef28a26b928343cb9661da4dbf5482da";

    static verfyToken(token: string): UserSk | null {
        const verified = jwt.verify(token, SessionSecurity.jwtSecret);
        if (isString(verified)) {
            return parseInt(verified) as UserSk;
        }
        return null;
    }

    static getToken(userId: UserSk) {
        return jwt.sign(userId.toString(), SessionSecurity.jwtSecret);
    }
}

export class PasswordSecurity {
    static getHash(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    static compare(password: string, passwordHash: string) {
        return bcrypt.compareSync(password, passwordHash);
    }
}