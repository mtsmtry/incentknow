"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedUser = exports.toRelatedUser = exports.toIntactAccount = void 0;
var Utils_1 = require("../Utils");
function toIntactAccount(user) {
    return {
        userId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: Utils_1.toTimestamp(user.createdAt),
        email: user.email
    };
}
exports.toIntactAccount = toIntactAccount;
function toRelatedUser(user) {
    return {
        userId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: Utils_1.toTimestamp(user.createdAt)
    };
}
exports.toRelatedUser = toRelatedUser;
function toFocusedUser(user) {
    return {
        userId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: Utils_1.toTimestamp(user.createdAt)
    };
}
exports.toFocusedUser = toFocusedUser;
//# sourceMappingURL=User.js.map