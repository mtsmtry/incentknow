import { ContentCommit } from "../../entities/content/content_commit";
import { ContentDraft } from "../../entities/content/content_draft";
import { ContentEditing } from "../../entities/content/content_editing";
import { ContentSnapshot } from "../../entities/content/content_snapshot";
import { FocusedMaterialSnapshot, MaterialSnapshotId } from "../material/material_revision";

export type ContentSnapshotId = string;

export enum ContentSnapshotSource {
    COMMIT = "commit",
    SNAPSHOT = "snapshot",
    EDITING = "editing", // the latest snapshot of the specified editing
    DRAFT = "draft"
}

export interface ContentSnapshotStructure {
    source: ContentSnapshotSource;
    entityId: string;
    materials: MaterialSnapshotId[];
}

export function toContentSnapshotId(strc: ContentSnapshotStructure) {
    return `${strc.source}:${strc.entityId};${strc.materials.join(",")}`;
}

export function toContentSnapshotStructure(id: ContentSnapshotId): ContentSnapshotStructure {
    const array = id.split(";");
    const array2 = array[0].split(":");
    return {
        source: ContentSnapshotSource[array2[0]],
        entityId: array2[1],
        materials: array.slice(1)
    }
}

export interface RelatedContentSnapshot {
    snapshotId: ContentSnapshotId;
    timestamp: number;
}

export function toRelatedContentSnapshotFromSnapshot(snapshot: ContentSnapshot, materials: MaterialSnapshotId[]): RelatedContentSnapshot {
    return {
        snapshotId: toContentSnapshotId({
            source: ContentSnapshotSource.SNAPSHOT,
            entityId: snapshot.entityId,
            materials
        }),
        timestamp: toTimestamp(snapshot.timestamp),
    };
}

export function toRelatedContentSnapshotFromCommit(snapshot: ContentCommit, materials: MaterialSnapshotId[]): RelatedContentSnapshot {
    return {
        snapshotId: toContentSnapshotId({
            source: ContentSnapshotSource.COMMIT,
            entityId: snapshot.entityId,
            materials
        }),
        timestamp: toTimestamp(snapshot.timestamp),
    };
}

export function toRelatedContentSnapshotFromDraft(snapshot: ContentDraft, materials: MaterialSnapshotId[]): RelatedContentSnapshot {
    return {
        snapshotId: toContentSnapshotId({
            source: ContentSnapshotSource.DRAFT,
            entityId: snapshot.entityId,
            materials
        }),
        timestamp: toTimestamp(snapshot.updatedAt),
    };
}

export function toRelatedContentSnapshotFromEditing(snapshot: ContentEditing, materials: MaterialSnapshotId[]): RelatedContentSnapshot {
    return {
        snapshotId: toContentSnapshotId({
            source: ContentSnapshotSource.EDITING,
            entityId: snapshot.entityId,
            materials
        }),
        timestamp: toTimestamp(snapshot.updatedAt),
    };
}

export interface FocusedContentSnapshot {
    timestamp: number;
    data: string;
    materials: FocusedMaterialSnapshot[];
}

export function toFocusedContentSnapshotFromSnapshot(snapshot: ContentSnapshot, materials: FocusedMaterialSnapshot[]): FocusedContentSnapshot {
    return {
        timestamp: toTimestamp(snapshot.timestamp),
        data: snapshot.data,
        materials
    };
}

export function toFocusedContentSnapshotFromCommit(commit: ContentCommit, materials: FocusedMaterialSnapshot[]): FocusedContentSnapshot {
    return {
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        materials
    };
}

export function toFocusedContentSnapshotFromDraft(draft: ContentDraft, materials: FocusedMaterialSnapshot[]): FocusedContentSnapshot {
    return {
        timestamp: toTimestamp(draft.updatedAt),
        data: draft.data,
        materials
    };
}