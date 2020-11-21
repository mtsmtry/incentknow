
// Material ------------------------------

import { Material, MaterialType } from "../../entities/material/material";
import { MaterialDraft } from "../../entities/material/material_draft";
import { MaterialEditingState } from "../../entities/material/material_editing";
import { RelatedMaterialDraft, toRelatedMaterialDraft } from "./material_draft";
import { RelatedUser, toRelatedUser } from "../user/user";

export type MaterialId = string;

export interface RelatedMaterial {
    materialId: MaterialId;
    contentId: string;
    displayName: string;
    materialType: MaterialType;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
}

export function toRelatedMaterial(material: Material): RelatedMaterial {
    return {
        materialId: material.entityId,
        contentId: material.content.entityId,
        displayName: material.displayName,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser)
    };
}

export interface FocusedMaterial {
    materialId: MaterialId;
    contentId: string;
    displayName: string;
    materialType: MaterialType;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
    data: string;
    draft: RelatedMaterialDraft | null;
}

export function toFocusedMaterial(material: Material, draft: MaterialDraft | null): FocusedMaterial {
    return {
        materialId: material.entityId,
        contentId: material.content.entityId,
        displayName: material.displayName,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser),
        data: material.data,
        draft: toRelatedMaterialDraft(draft)
    };
}