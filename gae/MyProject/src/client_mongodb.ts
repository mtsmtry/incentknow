import * as typeorm from 'typeorm';
import { Collection } from 'realm';
import * as mongodb from 'mongodb';

const MONGODB_URI = "mongodb+srv://admin:21280712@cluster0.0df0y.gcp.mongodb.net/main?retryWrites=true&w=majority";

export class MongoClient {
    client: mongodb.MongoClient;

    async init() {
        this.client = await mongodb.MongoClient.connect(MONGODB_URI);
    }

    getContainer(containerId: string) {
        const container = this.client.db("containers").collection(containerId);
        return container;
    }
}