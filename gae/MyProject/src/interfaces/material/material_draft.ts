import { MaterialDraft } from "../../entities/material/material_draft";
import { RelatedMaterial, toRelatedMaterial } from "./material";

export type MaterialDraftId = string;

export interface RelatedMaterialDraft {
    draftId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
}

export function toRelatedMaterialDraft(draft: MaterialDraft): RelatedMaterialDraft {
    return {
        draftId: draft.entityId,
        displayName: draft.material ? draft.material.displayName : draft.intendedDisplayName,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
    };
}

export interface FocusedMaterialDraft {
    draftId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
    contentDraftId: string;
    material: RelatedMaterial;
    forkedCommitId: string;
    data: string;
}

export function toFocusedMaterialDraft(draft: MaterialDraft): FocusedMaterialDraft {
    return {
        draftId: draft.entityId,
        displayName: draft.material ? draft.material.displayName : draft.intendedDisplayName,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        contentDraftId: draft.intendedContentDraft?.entityId,
        material: toRelatedMaterial(draft.material),
        forkedCommitId: draft.forkedCommit.entityId,
        data: draft.data
    };
}
