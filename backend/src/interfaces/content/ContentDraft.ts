import { ObjectLiteral } from "typeorm";
import { ContentId } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentDraft, ContentDraftId } from "../../entities/content/ContentDraft";
import { FocusedFormat, toFocusedFormatFromStructure } from "../format/Format";
import { FocusedMaterialDraft } from "../material/MaterialDraft";
import { toTimestamp } from "../Utils";

export interface RelatedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    basedCommitId: ContentCommitId | null;
    data: any;
    contentId: ContentId | null;
    format: FocusedFormat;
}

export function toRelatedContentDraft(draft: ContentDraft): RelatedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.currentEditing?.basedCommit ? draft.currentEditing?.basedCommit?.entityId : null,
        data: draft.data,
        contentId: draft.content?.entityId || null,
        format: toFocusedFormatFromStructure(draft.structure)
    }
}

export interface FocusedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    basedCommitId: ContentCommitId | null;
    data: ObjectLiteral;    
    contentId: ContentId | null;
    materialDrafts: FocusedMaterialDraft[];
}

export function toFocusedContentDraft(draft: ContentDraft, data: ObjectLiteral, materialDrafts: FocusedMaterialDraft[]): FocusedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.currentEditing?.basedCommit ? draft.currentEditing?.basedCommit?.entityId : null,
        data: data,        
        contentId: draft.content?.entityId || null,
        materialDrafts: materialDrafts
    }
}
