import { SelectQueryBuilder } from "typeorm";

class MappedQuery<Entity, Result> {
    constructor(private qb: SelectQueryBuilder<Entity>, private convert: (ent: Entity) => Result) {
    }

    async getOne() {
        const entity = await this.qb.getOne();
        return entity ? this.convert(entity) : null;
    }

    async getNeededOne() {
        const entity = await this.qb.getOne();
        if (!entity) {
            throw "getNeededOne: Null";
        }
        return this.convert(entity);
    }

    async getMany() {
        const entities = await this.qb.getMany();
        return entities.map(this.convert);
    }

    async getOneWithRaw(): Promise<[Result, Entity] | [null, null]> {
        const entity = await this.qb.getOne();
        return entity ? [this.convert(entity), entity] : [null, null];
    }

    async getNeededOneWithRaw(): Promise<[Result, Entity]> {
        const entity = await this.qb.getOne();
        if (!entity) {
            throw "";
        }
        return [this.convert(entity), entity];
    }

    async getManyWithRaw(): Promise<{ result: Result, raw: Entity }[]> {
        const entities = await this.qb.getMany();
        return entities.map(x => ({ result: this.convert(x), raw: x }));
    }
}

export function mapQuery<Entity, Result>(qb: SelectQueryBuilder<Entity>, convert: (ent: Entity) => Result): MappedQuery<Entity, Result> {
    return new MappedQuery(qb, convert);
}