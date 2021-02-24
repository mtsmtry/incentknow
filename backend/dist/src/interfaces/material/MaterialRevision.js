"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedMaterialRevisionFromDraft = exports.toFocusedMaterialRevisionFromCommit = exports.toFocusedMaterialRevisionFromSnapshot = exports.toRelatedMaterialRevisionFromSnapshot = exports.toRelatedMaterialRevisionFromCommit = exports.toRelatedMaterialRevisionFromEditing = exports.toMaterialRevisionStructure = exports.toMaterialRevisionId = exports.MaterialRevisionSource = void 0;
var Utils_1 = require("../Utils");
var MaterialRevisionSource;
(function (MaterialRevisionSource) {
    MaterialRevisionSource["COMMIT"] = "commit";
    MaterialRevisionSource["SNAPSHOT"] = "snapshot";
    MaterialRevisionSource["EDITING"] = "editing";
    MaterialRevisionSource["DRAFT"] = "draft";
})(MaterialRevisionSource = exports.MaterialRevisionSource || (exports.MaterialRevisionSource = {}));
function toMaterialRevisionId(strc) {
    return strc.source + ":" + strc.entityId;
}
exports.toMaterialRevisionId = toMaterialRevisionId;
function toMaterialRevisionStructure(id) {
    var array = id.split(":");
    return {
        source: MaterialRevisionSource[array[0]],
        entityId: array[1]
    };
}
exports.toMaterialRevisionStructure = toMaterialRevisionStructure;
function toRelatedMaterialRevisionFromEditing(editing) {
    return {
        snapshotId: toMaterialRevisionId({ source: MaterialRevisionSource.EDITING, entityId: editing.entityId }),
        timestamp: Utils_1.toTimestamp(editing.createdAt),
        dataSize: 0,
    };
}
exports.toRelatedMaterialRevisionFromEditing = toRelatedMaterialRevisionFromEditing;
function toRelatedMaterialRevisionFromCommit(commit) {
    return {
        snapshotId: toMaterialRevisionId({ source: MaterialRevisionSource.COMMIT, entityId: commit.entityId }),
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
    };
}
exports.toRelatedMaterialRevisionFromCommit = toRelatedMaterialRevisionFromCommit;
function toRelatedMaterialRevisionFromSnapshot(snapshot) {
    return {
        snapshotId: toMaterialRevisionId({ source: MaterialRevisionSource.SNAPSHOT, entityId: snapshot.entityId }),
        timestamp: Utils_1.toTimestamp(snapshot.timestamp),
        dataSize: snapshot.dataSize,
    };
}
exports.toRelatedMaterialRevisionFromSnapshot = toRelatedMaterialRevisionFromSnapshot;
function toFocusedMaterialRevisionFromSnapshot(snapshot) {
    return {
        timestamp: Utils_1.toTimestamp(snapshot.timestamp),
        data: snapshot.data
    };
}
exports.toFocusedMaterialRevisionFromSnapshot = toFocusedMaterialRevisionFromSnapshot;
function toFocusedMaterialRevisionFromCommit(commit) {
    return {
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        data: commit.data
    };
}
exports.toFocusedMaterialRevisionFromCommit = toFocusedMaterialRevisionFromCommit;
function toFocusedMaterialRevisionFromDraft(draft, data) {
    return {
        timestamp: Utils_1.toTimestamp(draft.updatedAt),
        data: data
    };
}
exports.toFocusedMaterialRevisionFromDraft = toFocusedMaterialRevisionFromDraft;
//# sourceMappingURL=MaterialRevision.js.map