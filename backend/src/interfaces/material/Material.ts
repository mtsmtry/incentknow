
// Material ------------------------------

import { ContentId } from "../../entities/content/Content";
import { Material, MaterialId, MaterialType } from "../../entities/material/Material";
import { Data, DataKind, DataMember, Int, NewTypeString } from "../../Implication";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedMaterialDraft } from "./MaterialDraft";

export type DocumentBlockId = NewTypeString<"DocumentBlockId">;

export enum BlockType {
    PARAGRAPH = "paragraph",
    HEADER = "header"
}

export interface DocumentBlock {
    id: DocumentBlockId;
    data: BlockData;
}

@Data()
export class BlockData {
    @DataKind()
    type: BlockType;

    @DataMember([BlockType.HEADER])
    level?: Int;

    @DataMember([BlockType.PARAGRAPH, BlockType.HEADER])
    text?: string;
}

export interface Document {
    blocks: DocumentBlock[];
}

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

@Data()
export class MaterialData {
    @DataKind()
    type: MaterialType;

    @DataMember([MaterialType.DOCUMENT])
    document?: Document;

    @DataMember([MaterialType.PLAINTEXT])
    text?: string;
}

export function encodeMaterialData(mat: MaterialData): { data: string, textCount: number, beginning: string } {
    switch (mat.type) {
        case MaterialType.DOCUMENT:
            let text = "";
            mat.document?.blocks.forEach(block => {
                if (block.data.text) {
                    text += block.data.text + " ";
                }
            });
            return {
                data: JSON.stringify(mat.document),
                beginning: text.substring(0, 140),
                textCount: text.length
            };
        case MaterialType.PLAINTEXT:
            return {
                data: mat.text || "",
                beginning: mat.text?.substring(0, 140) || "",
                textCount: mat.text?.length || 0
            };
    }
}

export function toRelatedMaterial(material: Material): RelatedMaterial {
    return {
        materialId: material.entityId,
        contentId: material.content?.entityId || null,
        displayName: material.commit.beginning,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: material.creatorUser ? toRelatedUser(material.creatorUser) : null as any,
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: material.updaterUser ? toRelatedUser(material.updaterUser) : null as any
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
    data: MaterialData;
    draft: RelatedMaterialDraft | null;
}

export function toMaterialData(materialType: MaterialType, data: string) {
    const materialData: MaterialData = { type: materialType };
    switch (materialType) {
        case MaterialType.DOCUMENT:
            materialData.document = JSON.parse(data);
            break;
        case MaterialType.PLAINTEXT:
            materialData.text = data;
            break;
    }
    return materialData;
}

export function toFocusedMaterial(material: Material, draft: RelatedMaterialDraft | null): FocusedMaterial {
    return {
        materialId: material.entityId,
        contentId: material.content?.entityId || null,
        displayName: material.commit.beginning,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: material.creatorUser ? toRelatedUser(material.creatorUser) : null as any,
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: material.updaterUser ? toRelatedUser(material.updaterUser) : null as any,
        data: toMaterialData(material.materialType, material.commit.data),
        draft: draft
    };
}