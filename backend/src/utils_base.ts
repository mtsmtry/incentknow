import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";

export let conn: Connection;
export let userId: number;

export function setUserId(src: number) {
    userId = src;
}

export async function init() {
    var env: string = process.env.ENV_SETTINGS;
    const connectOption = require(`../ormconfig.${env}.json`);

    conn = await createConnection(connectOption);
    conn.transaction(rr => rr.getRepository())
    await conn.synchronize();
}

export async function getMyUser() {
    if (userId) {
        return await conn.getRepository(User).findOne({ entityId: this.userId });
    }
    return null;
}
