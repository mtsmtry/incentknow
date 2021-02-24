import { ObjectLiteral } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { ContentSk } from "../../../entities/content/Content";
import { StructureSk } from "../../../entities/format/Structure";
import { MaterialSk, MaterialType } from "../../../entities/material/Material";
import { UserSk } from "../../../entities/user/User";
import { PropertyInfo } from "../../../interfaces/format/Structure";
import { mapByString } from "../../../utils";
import { BaseCommand, BaseRepository } from "../../Repository";
import { Transaction } from "../../Transaction";
import { MaterialCommand, MaterialRepository } from "../material/MaterialRepository";
import { ContentCommand, ContentRepository } from "./ContentRepository.";

export class ContentWholeRepository implements BaseRepository<ContentWholeCommand> {
    constructor(
        private contents: ContentRepository,
        private materials: MaterialRepository) {
    }

    createCommand(trx: Transaction) {
        return new ContentWholeCommand(
            this.contents.createCommand(trx),
            this.materials.createCommand(trx));
    }
}

interface MaterialCreation {
    type: "creation";
    data: string;
    materialType: MaterialType;
}

interface MaterialMove {
    type: "move";
    materialId: MaterialSk;
}

interface ContentCreation {
    data: ObjectLiteral;
    materials: (MaterialCreation | MaterialMove)[];
}

interface MaterialUpdation {
    propertyId: string;
    data: string;
}

interface ContentUpdation {
    data: ObjectLiteral | null;
    materials: MaterialUpdation[];
}

export class ContentWholeCommand implements BaseCommand {
    constructor(
        private contents: ContentCommand,
        private materials: MaterialCommand) {
    }

    async createContent(containerId: ContainerSk, structureId: StructureSk, userId: UserSk, src: ContentCreation) {
        const content = await this.contents.createContent(containerId, structureId, userId, src.data);
        const promises = src.materials.map(async material => {
            if (material.type == "creation") {
                await this.materials.createMaterialInContent(content.raw.id, userId, material.data, material.materialType);
            } else {
                await this.materials.moveMaterialToContent(material.materialId, content.raw.id);
            }
        });
        await Promise.all(promises);
    }

    async updateContent(contentId: ContentSk, userId: UserSk, props: PropertyInfo[], src: ContentUpdation) {
        if (src.data) {
            await this.contents.updateContent(userId, contentId, src.data);
        } else {
            await this.contents.updateContentTimestamp(contentId);
            const propMap = mapByString(props, prop => prop.id);
            src.materials.map(async material => {
                const prop = propMap[material.propertyId];
                //await this.materials.updateMaterial(userId, material.data);
            });
        }
    }
}