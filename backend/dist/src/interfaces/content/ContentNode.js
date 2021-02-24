"use strict";
// [Contentの履歴表示戦略]
// 子要素のMaterialも含めて、包括的なNodeとSnapshotを生成する
Object.defineProperty(exports, "__esModule", { value: true });
exports.toContentNodes = exports.ContentNodeTarget = exports.toContentNodeTypeFromEditingState = exports.ContentNodeType = void 0;
var ContentEditing_1 = require("../../entities/content/ContentEditing");
var Utils_1 = require("../../Utils");
var MaterialRevision_1 = require("../material/MaterialRevision");
var User_1 = require("../user/User");
var ContentRevision_1 = require("./ContentRevision");
var ContentNodeType;
(function (ContentNodeType) {
    ContentNodeType["COMMITTED"] = "committed";
    ContentNodeType["PRESENT"] = "present";
    ContentNodeType["CANCELD"] = "canceled";
})(ContentNodeType = exports.ContentNodeType || (exports.ContentNodeType = {}));
function toContentNodeTypeFromEditingState(state) {
    switch (state) {
        case ContentEditing_1.ContentEditingState.CANCELD:
            return ContentNodeType.CANCELD;
        case ContentEditing_1.ContentEditingState.EDITING:
            return ContentNodeType.PRESENT;
        case ContentEditing_1.ContentEditingState.COMMITTED:
            return null;
    }
}
exports.toContentNodeTypeFromEditingState = toContentNodeTypeFromEditingState;
var ContentNodeTarget;
(function (ContentNodeTarget) {
    ContentNodeTarget["CONTENT"] = "content";
    ContentNodeTarget["MATERIAL"] = "material";
    ContentNodeTarget["WHOLE"] = "whole";
})(ContentNodeTarget = exports.ContentNodeTarget || (exports.ContentNodeTarget = {}));
function toContentNodes(editings, commits, materialEditings, materialCommits) {
    var editingDict = Utils_1.mapBy(editings, function (x) { return x.id; });
    var materialEditingDict = Utils_1.mapBy(materialEditings, function (x) { return x.id; });
    var materialCommitsByParent = Utils_1.groupBy(materialCommits, function (x) { return x.parentCommitId; });
    var materialEditingsByParent = Utils_1.groupBy(materialEditings, function (x) { return x.parentEditingId; });
    function fromEditing(editing) {
        var type = toContentNodeTypeFromEditingState(editing.state);
        if (!type) {
            return null;
        }
        var materials = materialEditingsByParent[editing.id].map(MaterialRevision_1.toRelatedMaterialRevisionFromEditing);
        return {
            type: type,
            target: materials.length > 0 ? ContentNodeTarget.WHOLE : ContentNodeTarget.CONTENT,
            user: User_1.toRelatedUser(editing.user),
            editingId: editing.entityId,
            rivision: ContentRevision_1.toRelatedContentRevisionFromEditing(editing, materials.map(function (x) { return x.snapshotId; }))
        };
    }
    function fromCommit(commit) {
        var _a;
        var materials = materialCommitsByParent[commit.id].map(MaterialRevision_1.toRelatedMaterialRevisionFromCommit);
        return {
            type: ContentNodeType.COMMITTED,
            target: materials.length > 0 ? ContentNodeTarget.WHOLE : ContentNodeTarget.CONTENT,
            user: User_1.toRelatedUser(commit.committerUser),
            editingId: commit.editingId ? (_a = editingDict[commit.editingId]) === null || _a === void 0 ? void 0 : _a.entityId : null,
            rivision: ContentRevision_1.toRelatedContentRevisionFromCommit(commit, materials.map(function (x) { return x.snapshotId; }))
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
    return editings.map(fromEditing).filter(Utils_1.notNull).concat(commits.map(fromCommit));
}
exports.toContentNodes = toContentNodes;
//# sourceMappingURL=ContentNode.js.map