
// Content ------------------------------

import { Content } from "../../entities/content/content";
import { ContentDraft } from "../../entities/content/content_draft";
import { ContentDraftId } from "./content_draft";
import { FocusedFormat, toFocusedFormatFromStructure } from "../format/format";
import { RelatedUser, toRelatedUser } from "../user/user";

export type ContentId = string;

export type SemanticId = string;

export interface RelatedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: number;
    viewCount: number;
    format: FocusedFormat;
    data: any;
}

export function toRelatedContent(content: Content, format: FocusedFormat): RelatedContent {
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        data: content.data
    };
}

export interface FocusedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: number;
    viewCount: number;
    format: FocusedFormat;
    draftId: ContentDraftId | null;
    data: any;
}

export function toFocusedContent(content: Content, draft: ContentDraft | null, format: FocusedFormat): FocusedContent {
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        draftId: draft?.entityId,
        data: content.data
    };
}



