import { MaterialCommit } from "../../entities/material/material_commit";
import { MaterialDraft } from "../../entities/material/material_draft";
import { MaterialEditing } from "../../entities/material/material_editing";
import { MaterialSnapshot } from "../../entities/material/material_snapshot";
import { NewTypeString } from "../../implication";

export type MaterialRevisionId = NewTypeString<"MaterialRevisionId">;

export enum MaterialRevisionSource {
    COMMIT = "commit",
    SNAPSHOT = "snapshot",
    EDITING = "editing", // the latest snapshot of the specified editing
    DRAFT = "draft"
}

export interface MaterialRevisionStructure {
    source: MaterialRevisionSource;
    entityId: string;
}

export function toMaterialRevisionId(strc: MaterialRevisionStructure): MaterialRevisionId {
    return `${strc.source}:${strc.entityId}` as MaterialRevisionId;
}

export function toMaterialRevisionStructure(id: MaterialRevisionId): MaterialRevisionStructure {
    const array = id.split(":");
    return {
        source: MaterialRevisionSource[array[0]],
        entityId: array[1]
    };
}

export interface RelatedMaterialRevision {
    snapshotId: MaterialRevisionId;
    timestamp: number;
    dataSize: number;
}

export function toRelatedMaterialRevisionFromEditing(editing: MaterialEditing): RelatedMaterialRevision {
    return {
        snapshotId: toMaterialRevisionId({ source: MaterialRevisionSource.EDITING, entityId: editing.entityId }),
        timestamp: toTimestamp(editing.createdAt),
        dataSize: 0,
    };
}

export function toRelatedMaterialRevisionFromCommit(commit: MaterialCommit): RelatedMaterialRevision {
    return {
        snapshotId: toMaterialRevisionId({ source: MaterialRevisionSource.COMMIT, entityId: commit.entityId }),
        timestamp: toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
    };
}

export function toRelatedMaterialRevisionFromSnapshot(snapshot: MaterialSnapshot): RelatedMaterialRevision {
    return {
        snapshotId: toMaterialRevisionId({ source: MaterialRevisionSource.SNAPSHOT, entityId: snapshot.entityId }),
        timestamp: toTimestamp(snapshot.timestamp),
        dataSize: snapshot.dataSize,
    };
}

export interface FocusedMaterialRevision {
    timestamp: number;
    data: string;
}

export function toFocusedMaterialRevisionFromSnapshot(snapshot: MaterialSnapshot): FocusedMaterialRevision {
    return {
        timestamp: toTimestamp(snapshot.timestamp),
        data: snapshot.data
    }
}

export function toFocusedMaterialRevisionFromCommit(commit: MaterialCommit): FocusedMaterialRevision {
    return {
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data
    }
}

export function toFocusedMaterialRevisionFromDraft(draft: MaterialDraft, data: string): FocusedMaterialRevision {
    return {
        timestamp: toTimestamp(draft.updatedAt),
        data
    }
}
