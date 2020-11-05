import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { MongoClient } from './client_mongodb';
import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";

export class UtilsBase {
    static mongo: MongoClient;
    static conn: Connection;
    static userId: string;

    static async init() {
        this.mongo = new MongoClient();
        await this.mongo.init();

        var env: string = process.env.ENV_SETTINGS;
        const connectOption = require(`../ormconfig.${env}.json`);

        this.conn = await createConnection(connectOption);
        await this.conn.synchronize();
    }

    static async getMyUser() {
        if (this.userId) {
            return await this.conn.getRepository(User).findOne({ entityId: this.userId });
        }
        return null;
    }
}