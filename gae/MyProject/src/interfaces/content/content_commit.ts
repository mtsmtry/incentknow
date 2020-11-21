import { ContentCommit } from "../../entities/content/content_commit";
import { RelatedUser, toRelatedUser } from "../user/user";

export type ContentCommitId = string;

export interface RelatedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    forkedCommitId: string;
    committerUser: RelatedUser;
}

export function toRelatedContentCommit(commit: ContentCommit): RelatedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        forkedCommitId: commit.forkedCommit.entityId,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

export interface FocusedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    forkedCommitId: string;
    committerUser: RelatedUser;
}

export function toFocusedContentCommit(commit: ContentCommit): FocusedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        forkedCommitId: commit.forkedCommit.entityId,
        committerUser: toRelatedUser(commit.committerUser)
    }
}