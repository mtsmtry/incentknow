import { ObjectLiteral } from "typeorm";
import { isFunction } from "util";
import { ServiceContext } from "./ServiceContext";

export class BaseService {
    protected ctx: ServiceContext;

    constructor(ctx: ServiceContext) {
        this.ctx = ctx;
    }

    execute(methodName: string, args: any[]): Promise<ObjectLiteral> | null {
        if (methodName.startsWith("_")) {
            return null;
        }
        const method = this[methodName];
        if (!method || !isFunction(method)) {
            return null;
        }
        return method(...args);
    }
}