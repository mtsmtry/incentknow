import { Repository } from "typeorm";
import { Material, MaterialSk, MaterialType } from "../entities/material/material";
import { MaterialCommit, MaterialCommitSk } from "../entities/material/material_commit";
import { MaterialEditing, MaterialEditingSk } from "../entities/material/material_editing";
import { User, UserSk } from "../entities/user/user";
import { MaterialQuery } from "./queries/material/material";
import { MaterialCommitQuery } from "./queries/material/material_commit";

export class MaterialRepository {
    constructor(
        private materials: Repository<Material>,
        private commits: Repository<MaterialCommit>) {
    }

    fromMaterials() {
        return new MaterialQuery(this.materials.createQueryBuilder("x"));
    }

    fromCommits() {
        return new MaterialCommitQuery(this.commits.createQueryBuilder("x"));
    }

    async createMaterial(userId: UserSk, data: string, displayName: string, materialType: MaterialType) {
        const material = this.materials.create({
            displayName,
            materialType,
            data,
            creatorUser: userId,
            updaterUser: userId
        });

        return await this.materials.save(material);
    }

    async commitMaterial(userId: UserSk, materialId: MaterialSk, data: string, forkedCommitId: MaterialCommitSk, editingId: MaterialEditingSk): Promise<MaterialCommit> {
        const commit = this.commits.create({
            materialId,
            editingId,
            forkedCommitId,
            data: data,
            committerUser: userId
        });

        return await this.commits.save(commit);
    }
}