import { ContentSk } from "../../../entities/content/Content";
import { Material, MaterialSk, MaterialType } from "../../../entities/material/Material";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { MaterialQuery, MaterialQueryFromEntity } from "../../queries/material/MaterialQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class MaterialRepository implements BaseRepository<MaterialCommand> {
    constructor(private materials: Repository<Material>) {
    }

    fromMaterials(trx?: Transaction) {
        return new MaterialQuery(this.materials.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new MaterialCommand(this.materials.createCommand(trx));
    }
}

export class MaterialCommand implements BaseCommand {
    constructor(private materials: Command<Material>) {
    }

    async transferToContent(materialId: MaterialSk, contentId: ContentSk) {
        await this.materials.update(materialId, { spaceId: null, contentId });
    }

    async transferToSpace(materialId: MaterialSk, spaceId: SpaceSk) {
        await this.materials.update(materialId, { spaceId, contentId: null });
    }

    async createMaterialInSpace(spaceId: SpaceSk, userId: UserSk, data: string, materialType: MaterialType) {
        let material = this.materials.create({
            spaceId,
            materialType,
            data,
            creatorUserId: userId,
            updaterUserId: userId
        });

        material = await this.materials.save(material);
        return new MaterialQueryFromEntity(material);
    }

    async createMaterialInContent(contentId: ContentSk, userId: UserSk, data: string, materialType: MaterialType) {
        let material = this.materials.create({
            contentId,
            materialType,
            data,
            creatorUserId: userId,
            updaterUserId: userId
        });

        material = await this.materials.save(material);
        return new MaterialQueryFromEntity(material);
    }

    async updateMaterial(userId: UserSk, materialId: MaterialSk, data: string) {
        await this.materials.update(materialId, {
            data,
            updaterUserId: userId
        });
    }
}