import { Comment, CommentId } from "../../entities/reactions/Comment";
import { Int } from "../../Implication";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export interface RelatedComment {
    commentId: CommentId;
    user: RelatedUser;
    text: string;
    createdAt: number;
    updatedAt: number;
}

export function toRelatedComment(comment: Comment): RelatedComment {
    return {
        commentId: comment.entityId,
        user: toRelatedUser(comment.user),
        text: comment.text,
        createdAt: toTimestamp(comment.createdAt),
        updatedAt: toTimestamp(comment.updatedAt),
    };
}

export interface FocusedComment {
    commentId: CommentId;
    user: RelatedUser;
    text: string;
    createdAt: number;
    updatedAt: number;
    likeCount: Int;
}

export function toFocusedComment(src: { comment: Comment, raw: any }): FocusedComment {
    return {
        commentId: src.comment.entityId,
        user: toRelatedUser(src.comment.user),
        text: src.comment.text,
        createdAt: toTimestamp(src.comment.createdAt),
        updatedAt: toTimestamp(src.comment.updatedAt),
        likeCount: src.raw?.likeCount || 0
    };
}

export interface FocusedTreeComment {
    commentId: CommentId;
    user: RelatedUser;
    text: string;
    createdAt: number;
    updatedAt: number;
    likeCount: Int;
    replies: FocusedComment[];
}

export function toFocusedTreeComment(comment: { comment: Comment, raw: any }, replies?: { comment: Comment, raw: any }[]): FocusedTreeComment {
    return {
        ...toFocusedComment(comment),
        replies: replies ? replies.map(toFocusedComment) : []
    };
}