import { EntityMetadata, FindConditions, FindManyOptions, FindOneOptions, FindOptionsUtils, ObjectLiteral } from "typeorm";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { Connection } from "typeorm/connection/Connection";
import { ObjectID } from "typeorm/driver/mongodb/typings";
import { EntityPersistExecutor } from "typeorm/persistence/EntityPersistExecutor";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { PlainObjectToNewEntityTransformer } from "typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer";
import { QueryRunner } from "typeorm/query-runner/QueryRunner";
import { SaveOptions } from "typeorm/repository/SaveOptions";
import { Transaction } from "./transaction";

export interface BaseRepository<T extends BaseCommand> {
    createCommand(transaction: Transaction): T;
}

export interface BaseReadonlyRepository {
}

export interface BaseCommand {
}

export class Repository<T> implements BaseRepository<Command<T>> {
    readonly connection: Connection;
    readonly metadata: EntityMetadata;
    protected plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer();

    constructor(connection: Connection, metadata: EntityMetadata) {
        this.connection = connection;
        this.metadata = metadata;
    }

    createCommand(transaction: Transaction): Command<T> {
        return new Command(this, transaction);
    }

    createQuery(transaction?: Transaction): SelectQueryBuilder<T> {
        const alias = "x";
        return new SelectQueryBuilder(this.connection, transaction?.queryRunner)
            .select(alias)
            .from(this.metadata.target, alias);
    }
}

export class Command<T> implements BaseCommand {
    readonly transaction: Transaction;
    readonly repository: Repository<T>;
    readonly queryRunner: QueryRunner;
    protected plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer();

    constructor(repository: Repository<T>, transaction: Transaction) {
        this.transaction = transaction;
        this.repository = repository;
        this.queryRunner = transaction.queryRunner;
    }

    createQueryBuilder(alias?: string) {
        return this.repository.createQueryBuilder(alias, this.transaction);
    }

    create(plainObject?: DeepPartial<T>): T;
    create(plainObjects?: DeepPartial<T>[]): T[];
    create(plainObjectOrObjects?: DeepPartial<T> | DeepPartial<T>[]): T | T[] {
        if (!plainObjectOrObjects)
            return this.repository.metadata.create(this.queryRunner);

        if (Array.isArray(plainObjectOrObjects))
            return plainObjectOrObjects.map(plainEntityLike => this.create(plainEntityLike));

        const mergeIntoEntity = this.repository.metadata.create(this.queryRunner);
        this.plainObjectToEntityTransformer.transform(mergeIntoEntity, plainObjectOrObjects, this.repository.metadata, true);
        return mergeIntoEntity;
    }

    save(entities: T[], options?: SaveOptions): Promise<T[]>;
    save(entity: T, options?: SaveOptions): Promise<T>;
    save(entity: T | T[], maybeOptions?: SaveOptions): Promise<T | T[]> {
        if (Array.isArray(entity) && entity.length === 0)
            return Promise.resolve(entity);

        return new EntityPersistExecutor(this.repository.connection, this.queryRunner, "save", this.repository.metadata.target, entity, maybeOptions)
            .execute()
            .then(() => entity);
    }

    update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {

        // if user passed empty criteria or empty list of criterias, then throw an error
        if (criteria === undefined ||
            criteria === null ||
            criteria === "" ||
            (Array.isArray(criteria) && criteria.length === 0)) {

            return Promise.reject(new Error(`Empty criteria(s) are not allowed for the update method.`));
        }

        if (typeof criteria === "string" ||
            typeof criteria === "number" ||
            criteria instanceof Date ||
            Array.isArray(criteria)) {

            return this.createQueryBuilder()
                .update(this.repository.metadata.target)
                .set(partialEntity)
                .whereInIds(criteria)
                .execute();

        } else {
            return this.createQueryBuilder()
                .update(this.repository.metadata.target)
                .set(partialEntity)
                .where(criteria)
                .execute();
        }
    }

    delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | any): Promise<DeleteResult> {

        // if user passed empty criteria or empty list of criterias, then throw an error
        if (criteria === undefined ||
            criteria === null ||
            criteria === "" ||
            (Array.isArray(criteria) && criteria.length === 0)) {

            return Promise.reject(new Error(`Empty criteria(s) are not allowed for the delete method.`));
        }

        if (typeof criteria === "string" ||
            typeof criteria === "number" ||
            criteria instanceof Date ||
            Array.isArray(criteria)) {

            return this.repository.createQueryBuilder(this.transaction)
                .delete()
                .from(this.repository.metadata.target)
                .whereInIds(criteria)
                .execute();

        } else {
            return this.repository.createQueryBuilder(this.transaction)
                .delete()
                .from(this.repository.metadata.target)
                .where(criteria)
                .execute();
        }
    }

    async increment(conditions: any, propertyPath: string, value: number | string): Promise<UpdateResult> {

        const column = this.repository.metadata.findColumnWithPropertyPath(propertyPath);
        if (!column)
            throw new Error(`Column ${propertyPath} was not found in ${this.repository.metadata.targetName} entity.`);

        if (isNaN(Number(value)))
            throw new Error(`Value "${value}" is not a number.`);

        const expression = value >= 0 ? " + " + value : " - " + (-value)

        // convert possible embeded path "social.likes" into object { social: { like: () => value } }
        const values: QueryDeepPartialEntity<T> = propertyPath
            .split(".")
            .reduceRight(
                (value, key) => ({ [key]: value }) as any,
                () => this.repository.connection.driver.escape(column.databaseName) + expression
            );

        return this.repository
            .createQueryBuilder("entity", this.transaction)
            .update(this.repository.metadata.target)
            .set(values)
            .where(conditions)
            .execute();
    }

    async findOne(idOrOptionsOrConditions?: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOneOptions<T> | FindConditions<T>, findOptions?: FindOneOptions<T>): Promise<T | undefined> {

        let options: ObjectLiteral | undefined = undefined;
        if (idOrOptionsOrConditions instanceof Object) {
            options = idOrOptionsOrConditions as ObjectLiteral;
        }

        let alias: string = this.repository.metadata.name;
        if (findOptions && findOptions.join) {
            alias = findOptions.join.alias;

        }
        const qb = this.createQueryBuilder(alias);

        if (!findOptions || findOptions.loadEagerRelations !== false)
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        const passedId = typeof idOrOptionsOrConditions === "string" || typeof idOrOptionsOrConditions === "number" || (idOrOptionsOrConditions as any) instanceof Date;

        let findManyOptions: FindManyOptions<T> | undefined = findOptions;
        if (!passedId) {
            findManyOptions = {
                ...(findOptions || {}),
                take: 1,
            };
        }

        FindOptionsUtils.applyOptionsToQueryBuilder(qb, findManyOptions);

        if (options) {
            qb.where(options);

        } else if (passedId) {
            qb.andWhereInIds(this.repository.metadata.ensureEntityIdMap(idOrOptionsOrConditions));
        }

        return qb.getOne();
    }

    async find(optionsOrConditions?: FindManyOptions<T> | FindConditions<T>): Promise<T[]> {
        const qb = this.createQueryBuilder(FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || this.repository.metadata.name);

        if (!FindOptionsUtils.isFindManyOptions(optionsOrConditions) || optionsOrConditions.loadEagerRelations !== false)
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.repository.metadata);

        return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getMany();
    }
}