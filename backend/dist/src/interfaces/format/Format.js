"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedFormatFromStructure = exports.toFocusedFormat = exports.toRelatedFormat = void 0;
var Space_1 = require("../space/Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var Structure_1 = require("./Structure");
function toRelatedFormat(format) {
    return {
        formatId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: Space_1.toRelatedSpace(format.space),
        usage: format.usage,
        createdAt: Utils_1.toTimestamp(format.createdAt),
        creatorUser: User_1.toRelatedUser(format.creatorUser),
        updatedAt: Utils_1.toTimestamp(format.updatedAt),
        updaterUser: User_1.toRelatedUser(format.updaterUser),
        semanticId: format.semanticId
    };
}
exports.toRelatedFormat = toRelatedFormat;
function toFocusedFormat(format) {
    return {
        formatId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: Space_1.toRelatedSpace(format.space),
        usage: format.usage,
        createdAt: Utils_1.toTimestamp(format.createdAt),
        creatorUser: User_1.toRelatedUser(format.creatorUser),
        updatedAt: Utils_1.toTimestamp(format.updatedAt),
        updaterUser: User_1.toRelatedUser(format.updaterUser),
        structure: Structure_1.toFocusedStructure(format.currentStructure),
        semanticId: format.semanticId
    };
}
exports.toFocusedFormat = toFocusedFormat;
function toFocusedFormatFromStructure(structure) {
    return {
        formatId: structure.format.entityId,
        displayId: structure.format.displayId,
        displayName: structure.format.displayName,
        description: structure.format.description,
        space: Space_1.toRelatedSpace(structure.format.space),
        usage: structure.format.usage,
        createdAt: Utils_1.toTimestamp(structure.format.createdAt),
        creatorUser: User_1.toRelatedUser(structure.format.creatorUser),
        updatedAt: Utils_1.toTimestamp(structure.format.updatedAt),
        updaterUser: User_1.toRelatedUser(structure.format.updaterUser),
        structure: Structure_1.toFocusedStructure(structure),
        semanticId: structure.format.semanticId
    };
}
exports.toFocusedFormatFromStructure = toFocusedFormatFromStructure;
//# sourceMappingURL=Format.js.map