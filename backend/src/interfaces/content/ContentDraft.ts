import { ObjectLiteral } from "typeorm";
import { ContentId } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentChangeType, ContentDraft, ContentDraftId } from "../../entities/content/ContentDraft";
import { FocusedFormat } from "../format/Format";
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
    changeType: ContentChangeType;
    isEditing: boolean;
}

export function toRelatedContentDraft(draft: ContentDraft, format: FocusedFormat): RelatedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.currentEditing?.basedCommit ? draft.currentEditing?.basedCommit?.entityId : null,
        data: draft.data,
        contentId: draft.content?.entityId || null,
        format,
        changeType: draft.changeType,
        isEditing: draft.currentEditingId != null
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
    format: FocusedFormat;
    changeType: ContentChangeType;
    isEditing: boolean;
}

export function toFocusedContentDraft(draft: ContentDraft, format: FocusedFormat, data: ObjectLiteral, materialDrafts: FocusedMaterialDraft[]): FocusedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.currentEditing?.basedCommit ? draft.currentEditing?.basedCommit?.entityId : null,
        data: data,
        contentId: draft.content?.entityId || null,
        materialDrafts: materialDrafts,
        format,
        changeType: draft.changeType,
        isEditing: draft.currentEditingId != null
    }
}
