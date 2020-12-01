import { ObjectLiteral } from "typeorm";
import { ContentCommitId } from "../../entities/content/content_commit";
import { ContentDraft, ContentDraftId } from "../../entities/content/content_draft";
import { FocusedFormat, toFocusedFormatFromStructure } from "../format/format";
import { FocusedMaterialDraft } from "../material/material_draft";

export interface RelatedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    forkedCommitId: ContentCommitId | null;
    data: any;
    format: FocusedFormat;
}

export function toRelatedContentDraft(draft: ContentDraft): RelatedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        forkedCommitId: draft.basedCommit ? draft.basedCommit?.entityId : null,
        data: draft.data,
        format: toFocusedFormatFromStructure(draft.structure)
    }
}

export interface FocusedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    basedCommitId: ContentCommitId | null;
    data: ObjectLiteral;
    materialDrafts: FocusedMaterialDraft[];
}

export function toFocusedContentDraft(draft: ContentDraft, data: ObjectLiteral, materialDrafts: FocusedMaterialDraft[]): FocusedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.basedCommit ? draft.basedCommit.entityId : null,
        data: data,
        materialDrafts: materialDrafts
    }
}
