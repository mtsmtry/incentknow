import { ContentDraftId } from "../../entities/content/ContentDraft";
import { MaterialType } from "../../entities/material/Material";
import { MaterialCommitId } from "../../entities/material/MaterialCommit";
import { MaterialDraft, MaterialDraftId } from "../../entities/material/MaterialDraft";
import { toTimestamp } from "../Utils";
import { MaterialData, RelatedMaterial, toMaterialData, toRelatedMaterial } from "./Material";

export interface RelatedMaterialDraft {
    draftId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
    isEditing: boolean;
}

export function toRelatedMaterialDraft(draft: MaterialDraft): RelatedMaterialDraft {
    return {
        draftId: draft.entityId,
        displayName: draft.currentEditing?.snapshot.beginning || "",
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        isEditing: draft.currentEditingId != null
    };
}

export interface FocusedMaterialDraft {
    draftId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
    material: RelatedMaterial | null;
    basedCommitId: MaterialCommitId | null;
    data: MaterialData;
    isEditing: boolean;
}

export function toFocusedMaterialDraft(draft: MaterialDraft, data: string): FocusedMaterialDraft {
    return {
        draftId: draft.entityId,
        displayName: draft.currentEditing?.snapshot.beginning || "",
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        material: draft.material ? toRelatedMaterial(draft.material) : null,
        basedCommitId: draft.currentEditing?.basedCommit?.entityId || null,
        data: toMaterialData(MaterialType.DOCUMENT, data),
        isEditing: draft.currentEditingId != null
    };
}
