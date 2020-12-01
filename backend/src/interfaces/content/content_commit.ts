import { ContentCommit, ContentCommitId } from "../../entities/content/content_commit";
import { RelatedUser, toRelatedUser } from "../user/user";

export interface RelatedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    basedCommitId: ContentCommitId | null;
    committerUser: RelatedUser;
}

export function toRelatedContentCommit(commit: ContentCommit): RelatedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        basedCommitId: commit.basedCommit ? commit.basedCommit.entityId : null,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

export interface FocusedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    basedCommitId: ContentCommitId | null;
    committerUser: RelatedUser;
}

export function toFocusedContentCommit(commit: ContentCommit): FocusedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        basedCommitId: commit.basedCommit ? commit.basedCommit.entityId : null,
        committerUser: toRelatedUser(commit.committerUser)
    }
}