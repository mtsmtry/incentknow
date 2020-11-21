import { ContentDraft } from "../../entities/content/content_draft";
import { ContentEditingState } from "../../entities/content/content_editing";
import { MaterialDraft } from "../../entities/material/material_draft";
import { FocusedFormat, toFocusedFormatFromStructure } from "../format/format";
import { FocusedMaterialDraft, toFocusedMaterialDraft } from "../material/material_draft";

export type ContentDraftId = string;

export interface RelatedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    forkedCommitId: string;
    data: any;
    format: FocusedFormat;
}

export function toRelatedContentDraft(draft: ContentDraft): RelatedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        forkedCommitId: draft.forkedCommit?.entityId,
        data: draft.data,
        format: toFocusedFormatFromStructure(draft.structure)
    }
}

export interface FocusedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    forkedCommitId: string;
    data: string;
    materialDrafts: FocusedMaterialDraft[];
}

export function toFocusedContentDraft(draft: ContentDraft, materialDrafts: MaterialDraft[]): FocusedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        forkedCommitId: draft.forkedCommit.entityId,
        data: draft.data,
        materialDrafts: materialDrafts.map(toFocusedMaterialDraft)
    }
}
