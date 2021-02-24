"use strict";
// Content ------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedContent = exports.toRelatedContent = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toRelatedContent(content, format) {
    return {
        contentId: content.entityId,
        createdAt: Utils_1.toTimestamp(content.createdAt),
        updatedAt: Utils_1.toTimestamp(content.updatedAt),
        creatorUser: User_1.toRelatedUser(content.creatorUser),
        updaterUser: User_1.toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        data: content.data
    };
}
exports.toRelatedContent = toRelatedContent;
function toFocusedContent(content, draft, format) {
    return {
        contentId: content.entityId,
        createdAt: Utils_1.toTimestamp(content.createdAt),
        updatedAt: Utils_1.toTimestamp(content.updatedAt),
        creatorUser: User_1.toRelatedUser(content.creatorUser),
        updaterUser: User_1.toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        draft: draft,
        data: content.data
    };
}
exports.toFocusedContent = toFocusedContent;
//# sourceMappingURL=Content.js.map