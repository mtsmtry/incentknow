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

    inEntityId(entityIds: TEntityId[]) {
        return new this.cstr(this.qb.where("x.entityId IN (:...ids)", { ids: entityIds }));
    }

    byDisplayId(displayId: TDIsplayId) {
        return new this.cstr(this.qb.where({ displayId }));
    }

    selectId() {
        return mapQuery(this.qb.select("x.id"), x => x["id"] as TSk);
    }

    getOne() {
        return this.qb.getOne();
    }

    limit(count: number) {
        return new this.cstr(this.qb.limit(count));
    }

    async getNeededOne() {
        const one = await this.qb.getOne();
        if (!one) {
            throw new Error("getNeededOne:" + this.qb.getSql());
        }
        return one;
    }

    getMany() {
        return this.qb.getMany();
    }

    getCount() {
        return this.qb.getCount();
    }
}

export class SelectQueryFromEntity<T> {
    constructor(private ent: T) {
    }

    get raw() {
        return this.ent;
    }
}