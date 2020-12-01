import { ContentDraftId } from "../../entities/content/content_draft";
import { MaterialCommitId } from "../../entities/material/material_commit";
import { MaterialDraft, MaterialDraftId } from "../../entities/material/material_draft";
import { RelatedMaterial } from "./material";

export interface RelatedMaterialDraft {
    draftId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
}

export function toRelatedMaterialDraft(draft: MaterialDraft): RelatedMaterialDraft {
    return {
        draftId: draft.entityId,
        displayName: draft.material?.beginning || draft.beginning || "",
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
    };
}

export interface FocusedMaterialDraft {
    draftId: MaterialDraftId;
    displayName: string;
    createdAt: number;
    updatedAt: number;
    contentDraftId: ContentDraftId | null;
    material: RelatedMaterial | null;
    basedCommitId: MaterialCommitId | null;
    data: string;
}

export function toFocusedMaterialDraft(draft: MaterialDraft, data: string, material: RelatedMaterial | null): FocusedMaterialDraft {
    return {
        draftId: draft.entityId,
        displayName: draft.material?.beginning || draft.beginning || "",
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        contentDraftId: draft.intendedContentDraft?.entityId || null,
        material: material,
        basedCommitId: draft.basedCommit?.entityId || null,
        data: data
    };
}
