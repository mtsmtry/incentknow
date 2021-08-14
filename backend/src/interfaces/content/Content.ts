import { Content, ContentId } from "../../entities/content/Content";
import { Int } from "../../Implication";
import { FocusedFormat } from "../format/Format";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedContentDraft } from "./ContentDraft";

export interface RelatedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: Int;
    viewCount: Int;
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
        data: content.commit.data
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
        data: content.commit.data
    };
}



