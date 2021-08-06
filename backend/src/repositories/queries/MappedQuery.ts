import { SelectQueryBuilder } from "typeorm";

/*
    Typeormは対象となるEntityに対してentitiesを1つにまとめるが、rawに対してはそれが機能しないため、
    x_idを基準に独自にまとめる。
*/
function settleRaw(raws: any[]) {
    if (raws.length <= 1) {
        return raws;
    }
    if (raws[0].x_id === undefined) {
        return raws;
    }
    const result: any[] = [];
    let prevId: number | null = null;
    raws.forEach(raw => {
        if (prevId != raw.x_id) {
            result.push(raw);
        }
        prevId = raw.x_id;
    });
    return result;
}

class MappedQuery<Entity, Result> {
    constructor(private qb: SelectQueryBuilder<Entity>, private convert: (ent: Entity, raw: any) => Result) {
    }

    async getOne() {
        const result = await this.qb.getRawAndEntities();
        return result.entities.length > 0 ? this.convert(result.entities[0], result.raw[0]) : null;
    }

    async getNeededOne() {
        const result = await this.qb.getRawAndEntities();
        if (result.entities.length == 0) {
            throw "getNeededOne: Null";
        }
        return this.convert(result.entities[0], result.raw[0]);
    }

    async getMany() {
        const result = await this.qb.getRawAndEntities();
        result.raw = settleRaw(result.raw);
        return result.entities.map((ent, i) => this.convert(ent, result.raw[i]));
    }

    async getOneWithRaw(): Promise<[Result, Entity] | [null, null]> {
        const result = await this.qb.getRawAndEntities();
        return result.entities.length > 0 ? [this.convert(result.entities[0], result.raw[0]), result.entities[0]] : [null, null];
    }

    async getNeededOneWithRaw(): Promise<[Result, Entity]> {
        const result = await this.qb.getRawAndEntities();
        if (result.entities.length == 0) {
            throw "";
        }
        return [this.convert(result.entities[0], result.raw[0]), result.entities[0]];
    }

    async getManyWithRaw(): Promise<{ result: Result, raw: Entity }[]> {
        const result = await this.qb.getRawAndEntities();
        result.raw = settleRaw(result.raw);
        return result.entities.map((ent, i) => ({ result: this.convert(ent, result.raw[i]), raw: ent }));
    }
}

export function mapQuery<Entity, Result>(qb: SelectQueryBuilder<Entity>, convert: (ent: Entity, raw: any) => Result): MappedQuery<Entity, Result> {
    return new MappedQuery(qb, convert);
}