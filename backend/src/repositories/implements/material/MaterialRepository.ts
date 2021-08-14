import { ContentSk } from "../../../entities/content/Content";
import { Material, MaterialSk, MaterialType } from "../../../entities/material/Material";
import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { MaterialEditingSk } from "../../../entities/material/MaterialEditing";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { MaterialCommitQuery, MaterialCommitQueryFromEntity } from "../../queries/material/MaterialCommitQuery";
import { MaterialQuery, MaterialQueryFromEntity } from "../../queries/material/MaterialQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class MaterialRepository implements BaseRepository<MaterialCommand> {
    constructor(
        private materials: Repository<Material>,
        private commits: Repository<MaterialCommit>) {
    }

    fromMaterials(trx?: Transaction) {
        return new MaterialQuery(this.materials.createQuery(trx));
    }

    fromCommits(trx?: Transaction) {
        return new MaterialCommitQuery(this.commits.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new MaterialCommand(this.materials.createCommand(trx), this.commits.createCommand(trx));
    }
}

export class MaterialCommand implements BaseCommand {
    constructor(private materials: Command<Material>, private commits: Command<MaterialCommit>) {
    }

    async transferToContent(materialId: MaterialSk, contentId: ContentSk) {
        await this.materials.update(materialId, { spaceId: null, contentId });
    }

    async transferToSpace(materialId: MaterialSk, spaceId: SpaceSk) {
        await this.materials.update(materialId, { spaceId, contentId: null });
    }

    async createMaterialInSpace(spaceId: SpaceSk, userId: UserSk, data: string, materialType: MaterialType, editingId: MaterialEditingSk) {
        let material = this.materials.create({
            spaceId,
            materialType,
            creatorUserId: userId,
            updaterUserId: userId
        });
        material = await this.materials.save(material);

        let commit = this.commits.create({
            materialId: material.id,
            editingId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        await this.materials.update(material.id, { commitId: commit.id });

        return new MaterialQueryFromEntity(material);
    }

    async createMaterialInContent(contentId: ContentSk, userId: UserSk, data: string, materialType: MaterialType, editingId: MaterialEditingSk) {
        let material = this.materials.create({
            contentId,
            materialType,
            creatorUserId: userId,
            updaterUserId: userId
        });
        material = await this.materials.save(material);

        let commit = this.commits.create({
            materialId: material.id,
            editingId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        await this.materials.update(material.id, { commitId: commit.id });

        return new MaterialQueryFromEntity(material);
    }

    async commitMaterial(userId: UserSk, materialId: MaterialSk, data: string, editingId: MaterialEditingSk) {
        let commit = this.commits.create({
            materialId,
            editingId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        await this.materials.update(materialId, {
            commitId: commit.id,
            updaterUserId: userId
        });

        return new MaterialCommitQueryFromEntity(commit);
    }
}