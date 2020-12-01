import { MaterialCommit, MaterialCommitId } from "../../entities/material/material_commit";
import { RelatedUser, toRelatedUser } from "../user/user";

export interface RelatedMaterialCommit {
    commitId: MaterialCommitId;
    timestamp: number;
    dataSize: number;
    basedCommitId: MaterialCommitId | null;
    committerUser: RelatedUser;
}

export function toRelatedMaterialCommit(commit: MaterialCommit): RelatedMaterialCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
        basedCommitId: commit.basedCommit?.entityId || null,
        committerUser: toRelatedUser(commit.committerUser)
    }
}

export interface FocusedMaterialCommit {
    commitId: MaterialCommitId;
    timestamp: number;
    data: string;
    dataSize: number;
}

export function toFocusedMaterialCommit(commit: MaterialCommit): FocusedMaterialCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        dataSize: commit.dataSize
    }
}