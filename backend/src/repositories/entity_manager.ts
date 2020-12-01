import { Connection } from "typeorm";
import { MaterialCommit } from "../entities/material/material_commit";
import { Repository } from "./repository";
import { MaterialCommitRepository } from "./implements/material/material_commit";

class EntityManager {
    readonly connection: Connection;

    constructor() {

    }

    private getRepository<T>(target: { new(): T; }) {
        const metadata = this.connection.getMetadata(target);
        return new Repository<T>(this.connection, metadata);
    }

    materialCommit() {
        return new MaterialCommitRepository(this.getRepository(MaterialCommit));
    }

    material() {
        return new Material(this.getRepository())
    }
}