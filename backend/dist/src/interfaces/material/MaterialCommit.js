"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedMaterialCommit = exports.toRelatedMaterialCommit = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toRelatedMaterialCommit(commit) {
    var _a;
    return {
        commitId: commit.entityId,
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
        basedCommitId: ((_a = commit.basedCommit) === null || _a === void 0 ? void 0 : _a.entityId) || null,
        committerUser: User_1.toRelatedUser(commit.committerUser)
    };
}
exports.toRelatedMaterialCommit = toRelatedMaterialCommit;
function toFocusedMaterialCommit(commit) {
    return {
        commitId: commit.entityId,
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        data: commit.data,
        dataSize: commit.dataSize
    };
}
exports.toFocusedMaterialCommit = toFocusedMaterialCommit;
//# sourceMappingURL=MaterialCommit.js.map