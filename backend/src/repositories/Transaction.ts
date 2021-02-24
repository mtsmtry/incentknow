import { Connection, QueryRunner } from "typeorm";

export class Transaction {
    readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    static async transaction<T>(connection: Connection, runInTransaction: (trx: Transaction) => Promise<T>): Promise<T> {
        const queryRunner = connection.createQueryRunner();

        try {
            await queryRunner.startTransaction();
            const trx = new Transaction(queryRunner);
            const result = await runInTransaction(trx);
            await queryRunner.commitTransaction();
            return result;

        } catch (err) {
            try {
                await queryRunner.rollbackTransaction();
            } catch (rollbackError) {

            }
            throw err;

        } finally {
            await queryRunner.release();
        }
    }
}