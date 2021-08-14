import { MaterialCommit, MaterialCommitId } from "../../entities/material/MaterialCommit";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export interface RelatedMaterialCommit {
    commitId: MaterialCommitId;
    timestamp: number;
    textCount: number;
    basedCommitId: MaterialCommitId | null;
    committerUser: RelatedUser;
}

export function toRelatedMaterialCommit(commit: MaterialCommit): RelatedMaterialCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        textCount: commit.textCount,
        basedCommitId: commit.basedCommit?.entityId || null,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

export interface FocusedMaterialCommit {
    commitId: MaterialCommitId;
    timestamp: number;
    data: string;
    textCount: number;
}

export function toFocusedMaterialCommit(commit: MaterialCommit): FocusedMaterialCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        textCount: commit.textCount
    }
}