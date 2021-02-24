"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIntactSpaceMembershipApplication = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toIntactSpaceMembershipApplication(app) {
    return {
        user: User_1.toRelatedUser(app.user),
        appliedAt: Utils_1.toTimestamp(app.appliedAt)
    };
}
exports.toIntactSpaceMembershipApplication = toIntactSpaceMembershipApplication;
//# sourceMappingURL=SpaceMembershipApplication.js.map