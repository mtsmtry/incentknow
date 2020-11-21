import { SelectQueryBuilder } from "typeorm";

export class SelectFromSingleTableQuery<Entity, T> {
    constructor(
        protected qb: SelectQueryBuilder<Entity>, 
        private cstr: new (x: SelectQueryBuilder<Entity>) => T) {
    }

    byId(id: number) {
        return new this.cstr(this.qb.where("id = :id", { id }));
    }

    byEntityId(entityId: string) {
        return new this.cstr(this.qb.where("entityId = :entityId", { entityId }));
    }

    byDisplayId(displayId: string) {
        return new this.cstr(this.qb.where("displayId = :displayId", { displayId }));
    }

    getOne() {
        return this.qb.getOne();
    }

    getMany() {
        return this.qb.getMany();
    }
}