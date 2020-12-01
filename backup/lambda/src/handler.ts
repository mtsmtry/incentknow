import * as mongodb from 'mongodb';
import { Collection } from 'realm';

type MongoNumber = number;

type NotUndefinedUnary = string | number | boolean | symbol;

type NotIncludeUndefined = NotUndefinedUnary | { [key: string]: NotIncludeUndefined };

export type Data = NotIncludeUndefined;

export interface Content {
    createdAt: number,
    creatorUserId: string,
    data: Data,
    structureId: string,
    updateCount: MongoNumber,
    updatedAt: number,
    updaterUserId: string,
    version: MongoNumber,
    viewCount: MongoNumber
}

export interface ContentWithFormat extends Content {
    format: FormatWithStructure;
}

export interface FormatWithStructure extends Format {
    structure: Structure;
}

export interface Format {
    createdAt: number,
    creatorUserId: string,
    description: string,
    displayId: string,
    displayName: string,
    generator: string,
    currentStructureId: string,
    semanticId: string | null,
    spaceId: string,
    updatedAt: number,
    updaterUserId: string,
    usage: string,
    relations: string[]
}

export interface Container {
    _id: mongodb.ObjectID,
    spaceId: string,
    formatId: string
}

export interface Property {
    displayName: string,
    fieldName: string | null,
    id: string,
    optional: boolean,
    semantic: string | null,
    type: Type
}

export interface Type {
    name: string;
    arguments: any;
}

export interface Structure {
    properties: Property[]
}

export interface User {
    displayId: string,
    displayName: string,
    iconUrl: string | null
}

export interface Space {
    createdAt: number,
    creatorUserId: string,
    description: string,
    displayId: string,
    displayName: string,
    homeUrl: string | null,
    formatCount: MongoNumber,
    committerCount: MongoNumber,
    memberCount: MongoNumber,
    membershipMethod: string,
    published: boolean,
    authority: { base: string }
}

export interface Crawler {
    definitionId: string,
    displayName: string,
    spaceId: string,
    updatedAt: number,
    updaterUserId: string
}

export interface Reactor {
    spaceId: string,
    formatId: string,
    state: string,
    definitionId: string | null,
    createdAt: number,
    creatorUserId: string
}

export interface Junction {
    containerId: string;
    formatId: string;
    structureId: string;
}

class MongoClient {
    constructor(private client: mongodb.MongoClient) {
    }

    async container(spaceId: string, formatId: string) {
        const containerInfo: Container | null = await this.client.db("main").collection("containers").findOne({ spaceId, formatId });
        if (!containerInfo) {
            return null;
        }
        const container: mongodb.Collection<Content> = this.client.db("containers").collection(containerInfo._id.toString());
        return container;
    }

    containerById(containerId: string) {
        const container: mongodb.Collection<Content> = this.client.db("containers").collection(containerId);
        return container;
    }

    get formats(): mongodb.Collection<Format> {
        return this.client.db("main").collection("formats");
    }

    get structures(): mongodb.Collection<Structure> {
        return this.client.db("main").collection("structures");
    }

    get users(): mongodb.Collection<User> {
        return this.client.db("main").collection("users");
    }

    get spaces(): mongodb.Collection<Space> {
        return this.client.db("main").collection("spaces");
    }

    get reactors(): mongodb.Collection<Reactor> {
        return this.client.db("main").collection("reactors");
    }

    get crawlers(): mongodb.Collection<Crawler> {
        return this.client.db("main").collection("crawlers");
    }

    get junctions(): mongodb.Collection<Junction> {
        return this.client.db("main").collection("contents");
    }
}

function byId(id: string) {
    return { _id: new mongodb.ObjectID(id) };
}

class Server {
    constructor(private client: MongoClient) {
    }

    async getContent(contentId: string) {
        const junction = await this.client.junctions.findOne(byId(contentId));
        if (!junction) {
            throw "not found function";
        }
        const container = this.client.containerById(junction.containerId);
        const [content, format, structure] = await Promise.all(
            [ container.findOne(byId(contentId))
            , this.client.formats.findOne(byId(junction.formatId))
            , this.client.structures.findOne(byId(junction.structureId))
            ]);

        if (!content || !format || !structure) {
            throw "";
        }
        const formatWithStructure: FormatWithStructure = Object.assign(format, { structure });
        const contentWIthFormat: ContentWithFormat = Object.assign(content, { format: formatWithStructure });
        return contentWIthFormat;
    }

    async getFormat(formatId: string) {
        const format = await this.client.formats.findOne(byId(formatId));
        if (!format) {
            throw "";
        }
        const structure = await this.client.structures.findOne(byId(format.currentStructureId));
        if (!structure) {
            throw "";
        }
        const formatWithStructure: FormatWithStructure = Object.assign(format, { structure });
        return formatWithStructure;
    }

    async getStructures(formatId: string) {
        const structures = await this.client.structures.find({ formatId });
        return structures;
    }

    async getSpace(spaceId: string) {
    }
}

async function getConnection() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw "MONGODB_URI is undefined";
    }
    const client = await mongodb.MongoClient.connect(uri);
    const aa: mongodb.Collection<{ a: string }> = await client.db("a").collection("a");
    const aa2 = await aa.findOne({});
}