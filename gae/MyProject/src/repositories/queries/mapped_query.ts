import { SelectQueryBuilder } from "typeorm";

class MappedQuery<Entity, Result> {
    constructor(private qb: SelectQueryBuilder<Entity>, private convert: (ent: Entity) => Result) {
    }

    async getOne() {
        const entity = await this.qb.getOne();
        return this.convert(entity);
    }

    async getMany() {
        const entities = await this.qb.getMany();
        return entities.map(this.convert);
    }

    async getOneWithRaw(): Promise<[Result, Entity]> {
        const entity = await this.qb.getOne();
        return [this.convert(entity), entity];
    }
}

export function mapQuery<Entity, Result>(qb: SelectQueryBuilder<Entity>, convert: (ent: Entity) => Result): MappedQuery<Entity, Result> {
    return new MappedQuery(qb, convert);
}