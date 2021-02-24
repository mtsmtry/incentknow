"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedContentCommit = exports.toRelatedContentCommit = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toRelatedContentCommit(commit) {
    return {
        commitId: commit.entityId,
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        basedCommitId: commit.basedCommit ? commit.basedCommit.entityId : null,
        committerUser: User_1.toRelatedUser(commit.committerUser)
    };
}
exports.toRelatedContentCommit = toRelatedContentCommit;
function toFocusedContentCommit(commit) {
    return {
        commitId: commit.entityId,
        timestamp: Utils_1.toTimestamp(commit.timestamp),
        basedCommitId: commit.basedCommit ? commit.basedCommit.entityId : null,
        committerUser: User_1.toRelatedUser(commit.committerUser)
    };
}
exports.toFocusedContentCommit = toFocusedContentCommit;
//# sourceMappingURL=ContentCommit.js.map