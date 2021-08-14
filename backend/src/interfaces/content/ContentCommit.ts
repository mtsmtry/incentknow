import { ContentId } from "../../entities/content/Content";
import { ContentCommit, ContentCommitId } from "../../entities/content/ContentCommit";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export interface RelatedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    committerUser: RelatedUser;
    contentId: ContentId;
}

export function toRelatedContentCommit(commit: ContentCommit): RelatedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        committerUser: toRelatedUser(commit.committerUser),
        contentId: commit.content.entityId
    }
}

export interface FocusedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    committerUser: RelatedUser;
    contentId: ContentId;
}

export function toFocusedContentCommit(commit: ContentCommit): FocusedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        committerUser: toRelatedUser(commit.committerUser),
        contentId: commit.content.entityId
    }
}