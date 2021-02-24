import { SelectQueryBuilder } from "typeorm";
import { mapQuery } from "./MappedQuery";

export class SelectFromSingleTableQuery<Entity, T, TSk, TEntityId, TDIsplayId> {
    constructor(
        protected qb: SelectQueryBuilder<Entity>,
        private cstr: new (x: SelectQueryBuilder<Entity>) => T) {
    }

    byId(id: TSk) {
        return new this.cstr(this.qb.where({ id }));
    }

    byEntityId(entityId: TEntityId) {
        return new this.cstr(this.qb.where({ entityId }));
    }

    byDisplayId(displayId: TDIsplayId) {
        return new this.cstr(this.qb.where({ displayId }));
    }

    selectId() {
        return mapQuery(this.qb.select("id"), x => x["id"] as TSk);
    }

    getOne() {
        return this.qb.getOne();
    }

    async getNeededOne() {
        const one = await this.qb.getOne();
        if (!one) {
            throw "";
        }
        return one;
    }

    getMany() {
        return this.qb.getMany();
    }
}

export class SelectQueryFromEntity<T> {
    constructor(private ent: T) {
    }

    get raw() {
        return this.ent;
    }
}