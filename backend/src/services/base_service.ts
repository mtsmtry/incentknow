import { Transaction } from "../repositories/transaction";

export class BaseService {
    validateAuth(val: boolean) {

    }

    validateNotNull<T>(item: T | null | undefined, str?: string): item is T {
        return item != null;
    }

    validate(val: boolean, str: string) {

    }

    transaction<T>(fun: (trx: Transaction) => Promise<T>): Promise<T> {

    }
}