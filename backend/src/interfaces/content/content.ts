
// Content ------------------------------

import { Content, ContentId } from "../../entities/content/content";
import { FocusedFormat } from "../format/format";
import { RelatedUser, toRelatedUser } from "../user/user";
import { RelatedContentDraft } from "./content_draft";

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
    draft: RelatedContentDraft | null;
    data: any;
}

export function toFocusedContent(content: Content, draft: RelatedContentDraft | null, format: FocusedFormat): FocusedContent {
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        draft: draft,
        data: content.data
    };
}



