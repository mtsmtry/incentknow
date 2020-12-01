import { ObjectLiteral } from "typeorm";
import { ContentCommit } from "../../entities/content/content_commit";
import { ContentDraft } from "../../entities/content/content_draft";
import { ContentEditing } from "../../entities/content/content_editing";
import { ContentSnapshot } from "../../entities/content/content_snapshot";
import { NewTypeString } from "../../implication";
import { FocusedMaterialRevision, MaterialRevisionId } from "../material/material_revision";

export type ContentRevisionId = NewTypeString<"ContentRevisionId">;

export type ContentWholeRevisionId = NewTypeString<"ContentWholeRevisionId">;

export enum ContentRevisionSource {
    COMMIT = "commit",
    SNAPSHOT = "snapshot",
    EDITING = "editing", // the latest snapshot of the specified editing
    DRAFT = "draft"
}

export interface ContentRivisionStructure {
    source: ContentRevisionSource;
    entityId: string;
}

export interface ContentWholeRevisionStructure {
    content: ContentRevisionId;
    materials: MaterialRevisionId[];
}

export function toContentRevisionId(strc: ContentRivisionStructure) {
    return `${strc.source}:${strc.entityId}` as ContentRevisionId;
}

export function toContentWholeRevisionId(strc: ContentWholeRevisionStructure) {
    return `${strc.content};${strc.materials.join(",")}` as ContentWholeRevisionId;
}

export function toContentRevisionStructure(id: ContentRevisionId): ContentRivisionStructure {
    const array = id.split(":");
    return {
        source: ContentRevisionSource[array[0]],
        entityId: array[1]
    }
}

export function toContentWholeRevisionStructure(id: ContentWholeRevisionId): ContentWholeRevisionStructure {
    const array = id.split(";");
    return {
        content: array[0] as ContentRevisionId,
        materials: array.slice(1) as MaterialRevisionId[]
    }
}

export interface RelatedContentRevision {
    snapshotId: ContentWholeRevisionId;
    timestamp: number;
}

export function toRelatedContentRevisionFromSnapshot(snapshot: ContentSnapshot, materials: MaterialRevisionId[]): RelatedContentRevision {
    return {
        snapshotId: toContentWholeRevisionId({
            content: {
                source: ContentRevisionSource.SNAPSHOT,
                entityId: snapshot.entityId,
            },
            materials
        }),
        timestamp: toTimestamp(snapshot.timestamp),
    };
}

export function toRelatedContentRevisionFromCommit(snapshot: ContentCommit, materials: MaterialRevisionId[]): RelatedContentRevision {
    return {
        snapshotId: toContentWholeRevisionId({
            content: {
                source: ContentRevisionSource.COMMIT,
                entityId: snapshot.entityId,
            },
            materials
        }),
        timestamp: toTimestamp(snapshot.timestamp),
    };
}

export function toRelatedContentRevisionFromDraft(snapshot: ContentDraft, materials: MaterialRevisionId[]): RelatedContentRevision {
    return {
        snapshotId: toContentWholeRevisionId({
            content: {
                source: ContentRevisionSource.DRAFT,
                entityId: snapshot.entityId,
            },
            materials
        }),
        timestamp: toTimestamp(snapshot.updatedAt),
    };
}

export function toRelatedContentRevisionFromEditing(snapshot: ContentEditing, materials: MaterialRevisionId[]): RelatedContentRevision {
    return {
        snapshotId: toContentWholeRevisionId({
            content: {
                source: ContentRevisionSource.EDITING,
                entityId: snapshot.entityId,
            },
            materials
        }),
        timestamp: toTimestamp(snapshot.updatedAt),
    };
}

export interface FocusedContentRevision {
    timestamp: number;
    data: ObjectLiteral;
    materials: FocusedMaterialRevision[];
}

export function toFocusedContentRevisionFromSnapshot(snapshot: ContentSnapshot, materials: FocusedMaterialRevision[]): FocusedContentRevision {
    return {
        timestamp: toTimestamp(snapshot.timestamp),
        data: snapshot.data,
        materials
    };
}

export function toFocusedContentRevisionFromCommit(commit: ContentCommit, materials: FocusedMaterialRevision[]): FocusedContentRevision {
    return {
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        materials
    };
}

export function toFocusedContentRevisionFromDraft(draft: ContentDraft, data: ObjectLiteral, materials: FocusedMaterialRevision[]): FocusedContentRevision {
    return {
        timestamp: toTimestamp(draft.updatedAt),
        data: data,
        materials
    };
}