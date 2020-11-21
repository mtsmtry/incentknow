import { MaterialCommit } from "../../entities/material/material_commit";
import { RelatedUser, toRelatedUser } from "../user/user";

export type MaterialCommitId = string;

export interface RelatedMaterialCommit {
    commitId: MaterialCommitId;
    timestamp: number;
    dataSize: number;
    forkedCommitId: string;
    committerUser: RelatedUser;
}

export function toRelatedMaterialCommit(commit: MaterialCommit): RelatedMaterialCommit {
    return {
        commitId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
        forkedCommitId: commit.forkedCommit.entityId,
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