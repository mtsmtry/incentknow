"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIntactSpaceMember = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toIntactSpaceMember(member) {
    return {
        user: User_1.toRelatedUser(member.user),
        joinedAt: Utils_1.toTimestamp(member.joinedAt),
        type: member.type
    };
}
exports.toIntactSpaceMember = toIntactSpaceMember;
//# sourceMappingURL=SpaceMember.js.map