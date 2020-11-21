
// [Contentの履歴表示戦略]
// 子要素のMaterialも含めて、包括的なNodeとSnapshotを生成する

import { ContentCommit } from "../../entities/content/content_commit";
import { ContentEditing, ContentEditingState } from "../../entities/content/content_editing";
import { MaterialCommit } from "../../entities/material/material_commit";
import { MaterialEditing } from "../../entities/material/material_editing";
import { RelatedContentSnapshot, toRelatedContentSnapshotFromSnapshot } from "./content_snapshot";
import { RelatedUser, toRelatedUser } from "../user/user";

export enum ContentNodeType {
    COMMITTED = "committed",
    PRESENT = "present",
    CANCELD = "canceled"
}

export function toContentNodeTypeFromEditingState(state: ContentEditingState): ContentNodeType | null {
    switch (state) {
        case ContentEditingState.CANCELD:
            return ContentNodeType.CANCELD;
        case ContentEditingState.EDITING:
            return ContentNodeType.PRESENT;
        case ContentEditingState.COMMITTED:
            return null;
    }
}


export enum NodeTarget {
    CONTENT = "content",
    MATERIAL = "material",
    WHOLE = "whole"
}

export interface ContentNode {
    type: NodeType;
    target: NodeTarget;
    user: RelatedUser;
    editingId: string | null;
    snapshot: RelatedContentSnapshot;
}

export function toContentNodes(
    editings: ContentEditing[],
    commits: ContentCommit[],
    materialEditings: MaterialEditing[],
    materialCommits: MaterialCommit[]
): ContentNode[] {

    const editingDict = mapBy(editings, x => x.id);
    const materialEditingDict = mapBy(materialEditings, x => x.id);
    const materialCommitsByParent = groupBy(materialCommits, x => x.parentCommitId);
    const materialEditingsByParent = groupBy(materialEditings, x => x.parentEditingId);

    function fromEditing(editing: ContentEditing): ContentNode {
        const type = toContentNodeTypeFromEditingState(editing.state);
        if (!type) {
            return null;
        }

        const materials = materialEditingsByParent[editing.id].map(toRelatedMaterialSnapshotFromEditing);

        return {
            type: type,
            target: materials.length > 0 ? NodeTarget.WHOLE : NodeTarget.CONTENT,
            user: toRelatedUser(editing.user),
            editingId: editing.entityId,
            snapshot: toRelatedContentSnapshotFromSnapshot(editing, materials.map(x => x.snapshotId))
        };
    }

    function fromCommit(commit: ContentCommit): ContentNode {
        const materials = materialCommitsByParent[commit.id].map(toRelatedMaterialSnapshotFromCommit);

        return {
            type: NodeType.COMMITTED,
            target: materials.length > 0 ? NodeTarget.WHOLE : NodeTarget.CONTENT,
            user: toRelatedUser(commit.committerUser),
            editingId: editingDict[commit.editingId]?.entityId,
            snapshot: toRelatedMaterialSnapshotFromCommit(commit, materials.map(x => x.snapshotId))
        };
    }
    /*
    function fromMaterialCommit(commit: MaterialCommit): ContentNode {
        return {
            type: NodeType.COMMITTED,
            target: NodeTarget.MATERIAL,
            user: toRelatedUser(commit.committerUser),
            editingId: materialEditingDict[commit.id]?.entityId,
            snapshot: {
                source: null,
                timestamp: null,
                entityId: null,
                materials: [ {
                    source: 0,
                    entityId: materialEditingDict[commit.id]?.entityId,
                } ]
            }
        }
    }
    */
    return editings.map(fromEditing).filter(x => x).concat(commits.map(fromCommit));
}