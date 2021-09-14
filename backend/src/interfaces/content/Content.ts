import { Content, ContentId } from "../../entities/content/Content";
import { Int } from "../../Implication";
import { FocusedFormat, Relation } from "../format/Format";
import { FocusedTreeComment } from "../reactions/Comment";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedContentDraft } from "./ContentDraft";

export enum Authority {
    NONE = "none",
    READABLE = "readable",
    WRITABLE = "writable"
}

export interface RelatedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: Int;
    viewCount: Int;
    commentCount: Int;
    format: FocusedFormat;
    data: any;
    authority: Authority;
}

export function toRelatedContent(content: Content, format: FocusedFormat, authority: Authority, commentCount: number): RelatedContent {
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        commentCount,
        format: format,
        data: content.commit.data,
        authority
    };
}

export interface FocusedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: Int;
    viewCount: Int;
    commentCount: Int;
    format: FocusedFormat;
    authority: Authority;
    data: any;
}

export function toFocusedContent(content: Content, format: FocusedFormat, authority: Authority, commentCount: number): FocusedContent {
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        commentCount,
        authority,
        format: format,
        data: content.commit.data
    };
}

export interface ContentRelation {
    contents: RelatedContent[];
    relation: Relation;
}

export interface SearchedContent {
    content: RelatedContent;
    highlights: string[];
    score: number;
}

export interface IntactContentPage {
    content: FocusedContent;
    draft: RelatedContentDraft | null;
    comments: FocusedTreeComment[];
    relations: ContentRelation[];
}

export function toIntactContentPage(content: Content, format: FocusedFormat, authority: Authority, draft: RelatedContentDraft | null, comments: FocusedTreeComment[], relations: ContentRelation[]): IntactContentPage {
    return {
        content: toFocusedContent(content, format, authority, comments.length),
        draft,
        comments,
        relations
    }
}