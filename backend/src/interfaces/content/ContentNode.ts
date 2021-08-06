
// [Contentの履歴表示戦略]
// 子要素のMaterialも含めて、包括的なNodeとSnapshotを生成する

import { ContentCommit } from "../../entities/content/ContentCommit";
import { ContentEditing, ContentEditingState } from "../../entities/content/ContentEditing";
import { MaterialCommit } from "../../entities/material/MaterialCommit";
import { MaterialEditing } from "../../entities/material/MaterialEditing";
import { groupBy, mapBy, notNull } from "../../Utils";
import { toRelatedMaterialRevisionFromCommit, toRelatedMaterialRevisionFromEditing } from "../material/MaterialRevision";
import { RelatedUser, toRelatedUser } from "../user/User";
import { RelatedContentRevision, toRelatedContentRevisionFromCommit, toRelatedContentRevisionFromEditing } from "./ContentRevision";

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


export enum ContentNodeTarget {
    CONTENT = "content",
    MATERIAL = "material",
    WHOLE = "whole"
}

export interface ContentNode {
    type: ContentNodeType;
    target: ContentNodeTarget;
    user: RelatedUser;
    editingId: string | null;
    rivision: RelatedContentRevision;
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

    function fromEditing(editing: ContentEditing): ContentNode | null {
        const type = toContentNodeTypeFromEditingState(editing.state);
        if (!type) {
            return null;
        }

        const materials = (materialEditingsByParent[editing.id] || []).map(toRelatedMaterialRevisionFromEditing);

        return {
            type: type,
            target: materials.length > 0 ? ContentNodeTarget.WHOLE : ContentNodeTarget.CONTENT,
            user: toRelatedUser(editing.user),
            editingId: editing.entityId,
            rivision: toRelatedContentRevisionFromEditing(editing, materials.map(x => x.snapshotId))
        };
    }

    function fromCommit(commit: ContentCommit): ContentNode {
        const materials = (materialCommitsByParent[commit.id] || []).map(toRelatedMaterialRevisionFromCommit);

        return {
            type: ContentNodeType.COMMITTED,
            target: materials.length > 0 ? ContentNodeTarget.WHOLE : ContentNodeTarget.CONTENT,
            user: toRelatedUser(commit.committerUser),
            editingId: commit.editingId ? editingDict[commit.editingId]?.entityId : null,
            rivision: toRelatedContentRevisionFromCommit(commit, materials.map(x => x.snapshotId))
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
    return editings.map(fromEditing).filter(notNull).concat(commits.map(fromCommit));
}