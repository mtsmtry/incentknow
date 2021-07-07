import { ContentId } from "../../entities/content/Content";
import { ContentCommit, ContentCommitId } from "../../entities/content/ContentCommit";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export interface RelatedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    basedCommitId: ContentCommitId | null;
    committerUser: RelatedUser;
    contentId: ContentId;
}

export function toRelatedContentCommit(commit: ContentCommit): RelatedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        basedCommitId: commit.basedCommit ? commit.basedCommit.entityId : null,
        committerUser: toRelatedUser(commit.committerUser),
        contentId: commit.content.entityId
    }
}

export interface FocusedContentCommit {
    commitId: ContentCommitId;
    timestamp: number;
    basedCommitId: ContentCommitId | null;
    committerUser: RelatedUser;
    contentId: ContentId;
}

export function toFocusedContentCommit(commit: ContentCommit): FocusedContentCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        basedCommitId: commit.basedCommit ? commit.basedCommit.entityId : null,
        committerUser: toRelatedUser(commit.committerUser),
        contentId: commit.content.entityId
    }
}