"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedContentRevisionFromDraft = exports.toFocusedContentRevisionFromCommit = exports.toFocusedContentRevisionFromSnapshot = exports.toRelatedContentRevisionFromEditing = exports.toRelatedContentRevisionFromDraft = exports.toRelatedContentRevisionFromCommit = exports.toRelatedContentRevisionFromSnapshot = exports.toContentWholeRevisionStructure = exports.toContentRevisionStructure = exports.toContentWholeRevisionId = exports.toContentRevisionId = exports.ContentRevisionSource = void 0;
var Utils_1 = require("../Utils");
var ContentRevisionSource;
(function (ContentRevisionSource) {
    ContentRevisionSource["COMMIT"] = "commit";
    ContentRevisionSource["SNAPSHOT"] = "snapshot";
    ContentRevisionSource["EDITING"] = "editing";
    ContentRevisionSource["DRAFT"] = "draft";
})(ContentRevisionSource = exports.ContentRevisionSource || (exports.ContentRevisionSource = {}));
function toContentRevisionId(strc) {
    return strc.source + ":" + strc.entityId;
}
exports.toContentRevisionId = toContentRevisionId;
function toContentWholeRevisionId(strc) {
    return strc.content + ";" + strc.materials.join(",");
}
exports.toContentWholeRevisionId = toContentWholeRevisionId;
function toContentRevisionStructure(id) {
    var array = id.split(":");
    return {
        source: ContentRevisionSource[array[0]],
        entityId: array[1]
    };
}
exports.toContentRevisionStructure = toContentRevisionStructure;
function toContentWholeRevisionStructure(id) {
    var array = id.split(";");
    return {
        content: array[0],
        materials: array.slice(1)
    };
}
exports.toContentWholeRevisionStructure = toContentWholeRevisionStructure;
function toRelatedContentRevisionFromSnapshot(snapshot, materials) {
    return {
        snapshotId: toContentWholeRevisionId({
            content: toContentRevisionId({
                source: ContentRevisionSource.SNAPSHOT,
                entityId: snapshot.entityId,
            }),
            materials: materials
        }),
        timestamp: Utils_1.toTimestamp(snapshot.timestamp),
    };
}
exports.toRelatedContentRevisionFromSnapshot = toRelatedContentRevisionFromSnapshot;
function toRelatedContentRevisionFromCommit(snapshot, materials) {
    return {
        snapshotId: toContentWholeRevisionId({
            content: toContentRevisionId({
                source: ContentRevisionSource.COMMIT,
                entityId: snapshot.entityId,
            }),
            materials: materials
        }),
        timestamp: Utils_1.toTimestamp(snapshot.timestamp),
    };
}
exports.toRelatedContentRevisionFromCommit = toRelatedContentRevisionFromCommit;
function toRelatedContentRevisionFromDraft(snapshot, materials) {
    return {
        snapshotId: toContentWholeRevisionId({
            content: toContentRevisionId({
                source: ContentRevisionSource.DRAFT,
                entityId: snapshot.entityId,
            }),
            materials: materials
        }),
        timestamp: Utils_1.toTimestamp(snapshot.updatedAt),
    };
}
exports.toRelatedContentRevisionFromDraft = toRelatedContentRevisionFromDraft;
function toRelatedContentRevisionFromEditing(snapshot, materials) {
    return {
        snapshotId: toContentWholeRevisionId({
            content: toContentRevisionId({
                source: ContentRevisionSource.EDITING,
                entityId: snapshot.entityId,
            }),
            materials: materials
        }),
        timestamp: Utils_1.toTimestamp(snapshot.updatedAt),
    };
}
exports.toRelatedContentRevisionFromEditing = toRelatedContentRevisionFromEditing;
function toFocusedContentRevisionFromSnapshot(snapshot, materials) {
    return {
        timestamp: Utils_1.toTimestamp(snapshot.timestamp),
        data: snapshot.data,
        materials: materials
    };
}
exports.toFocusedContentRevisionFromSnapshot = toFocusedContentRevisionFromSnapshot;
function toFocusedContentRevisionFromCommit(commit, materials) {
    return {
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        data: commit.data,
        materials: materials
    };
}
exports.toFocusedContentRevisionFromCommit = toFocusedContentRevisionFromCommit;
function toFocusedContentRevisionFromDraft(draft, data, materials) {
    return {
        timestamp: Utils_1.toTimestamp(draft.updatedAt),
        data: data,
        materials: materials
    };
}
exports.toFocusedContentRevisionFromDraft = toFocusedContentRevisionFromDraft;
//# sourceMappingURL=ContentRevision.js.map