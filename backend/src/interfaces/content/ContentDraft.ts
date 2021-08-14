import { ObjectLiteral } from "typeorm";
import { ContentId } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentDraft, ContentDraftId } from "../../entities/content/ContentDraft";
import { FocusedFormat } from "../format/Format";
import { toTimestamp } from "../Utils";

export interface RelatedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    data: any;
    contentId: ContentId | null;
    format: FocusedFormat;
}

export function toRelatedContentDraft(draft: ContentDraft, format: FocusedFormat): RelatedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        data: draft.data,
        contentId: draft.content?.entityId || null,
        format
    }
}

export interface FocusedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    data: ObjectLiteral;
    contentId: ContentId | null;
    format: FocusedFormat;
}

export function toFocusedContentDraft(draft: ContentDraft, format: FocusedFormat): FocusedContentDraft {
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        data: draft.data,
        contentId: draft.content?.entityId || null,
        format
    }
}
