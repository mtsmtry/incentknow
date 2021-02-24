
// Material ------------------------------

import { ContentId } from "../../entities/content/Content";
import { Material, MaterialType } from "../../entities/material/Material";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedMaterialDraft } from "./MaterialDraft";

export type MaterialId = string;

export interface RelatedMaterial {
    materialId: MaterialId;
    contentId: ContentId | null;
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
        contentId: material.content?.entityId || null,
        displayName: material.beginning,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser)
    };
}

export interface FocusedMaterial {
    materialId: MaterialId;
    contentId: ContentId | null;
    displayName: string;
    materialType: MaterialType;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
    data: string;
    draft: RelatedMaterialDraft | null;
}

export function toFocusedMaterial(material: Material, draft: RelatedMaterialDraft | null): FocusedMaterial {
    return {
        materialId: material.entityId,
        contentId: material.content?.entityId || null,
        displayName: material.beginning,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser),
        data: material.data,
        draft: draft
    };
}