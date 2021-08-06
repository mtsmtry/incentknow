import { IncomingHttpHeaders } from "http";
import { Connection } from "typeorm";
import { isString } from "util";
import { UserSk } from "../entities/user/User";
import { Transaction } from "../repositories/Transaction";
import { LackOfAuthority } from "./Errors";
import { SessionSecurity } from "./Security";

export class ServiceContext {
    private userId: UserSk | null;

    constructor(public conn: Connection) {
        this.userId = null;
    }

    setHeaders(headers: IncomingHttpHeaders) {
        const session = headers["session"];
        if (isString(session)) {
            this.userId = SessionSecurity.verfyToken(session);
        } else {
            this.userId = null;
        }
    }

    getAuthorized() {
        if (!this.userId) {
            throw new LackOfAuthority();
        }
        return this.userId;
    }

    transaction<T>(runInTransaction: (trx: Transaction) => Promise<T>): Promise<T> {
        return Transaction.transaction(this.conn, runInTransaction);
    }

    transactionAuthorized<T>(runInTransaction: (trx: Transaction, userId: UserSk) => Promise<T>): Promise<T> {
        const userId = this.getAuthorized();
        return Transaction.transaction(this.conn, trx => runInTransaction(trx, userId));
    }
}