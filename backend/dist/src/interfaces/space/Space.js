"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedSpace = exports.toRelatedSpace = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toRelatedSpace(space) {
    return {
        spaceId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        createdAt: Utils_1.toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        published: space.published,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}
exports.toRelatedSpace = toRelatedSpace;
function toFocusedSpace(space) {
    return {
        spaceId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        creatorUser: User_1.toRelatedUser(space.creatorUser),
        createdAt: Utils_1.toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        published: space.published,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}
exports.toFocusedSpace = toFocusedSpace;
//# sourceMappingURL=Space.js.map