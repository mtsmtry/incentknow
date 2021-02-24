"use strict";
// Material ------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedMaterial = exports.toRelatedMaterial = void 0;
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toRelatedMaterial(material) {
    var _a;
    return {
        materialId: material.entityId,
        contentId: ((_a = material.content) === null || _a === void 0 ? void 0 : _a.entityId) || null,
        displayName: material.beginning,
        materialType: material.materialType,
        createdAt: Utils_1.toTimestamp(material.createdAt),
        creatorUser: User_1.toRelatedUser(material.creatorUser),
        updatedAt: Utils_1.toTimestamp(material.updatedAt),
        updaterUser: User_1.toRelatedUser(material.updaterUser)
    };
}
exports.toRelatedMaterial = toRelatedMaterial;
function toFocusedMaterial(material, draft) {
    var _a;
    return {
        materialId: material.entityId,
        contentId: ((_a = material.content) === null || _a === void 0 ? void 0 : _a.entityId) || null,
        displayName: material.beginning,
        materialType: material.materialType,
        createdAt: Utils_1.toTimestamp(material.createdAt),
        creatorUser: User_1.toRelatedUser(material.creatorUser),
        updatedAt: Utils_1.toTimestamp(material.updatedAt),
        updaterUser: User_1.toRelatedUser(material.updaterUser),
        data: material.data,
        draft: draft
    };
}
exports.toFocusedMaterial = toFocusedMaterial;
//# sourceMappingURL=Material.js.map