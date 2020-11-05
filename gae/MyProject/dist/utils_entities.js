"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedContentDraft = exports.toFocusedMaterialEditing = exports.toRelatedMaterialDraft = exports.toFocusedMaterialDraft = exports.toRelatedMaterialCommit = exports.toMaterialWorkNodes = exports.WorkNodeType = exports.toRelatedMaterialSnapshot = exports.toFocusedMaterialSnapshot = exports.toFocusedMaterialCommit = exports.toRelatedMaterial = exports.toFocusedMaterial = exports.toFocusedContent = exports.toFocusedFormatFromStructure = exports.toFocusedFormat = exports.toFocusedStructure = exports.toPropertyInfo = exports.toFocusedUser = exports.toRelatedUser = exports.toRelatedSpace = exports.toFocusedSpace = void 0;
var client_sql_1 = require("./client_sql");
function toTimestamp(date) {
    var milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}
function toFocusedSpace(space) {
    return {
        entityId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        creatorUser: toRelatedUser(space.creatorUser),
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}
exports.toFocusedSpace = toFocusedSpace;
function toRelatedSpace(space) {
    return {
        entityId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}
exports.toRelatedSpace = toRelatedSpace;
function toRelatedUser(user) {
    return {
        entityId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    };
}
exports.toRelatedUser = toRelatedUser;
function toFocusedUser(user) {
    return {
        entityId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    };
}
exports.toFocusedUser = toFocusedUser;
function toPropertyInfo(prop) {
    var _a, _b;
    var res = {
        id: prop.entityId,
        displayName: prop.displayName,
        fieldName: prop.fieldName,
        optional: prop.optional,
        semantic: prop.semantic,
        type: {
            name: prop.typeName,
            arguments: {}
        }
    };
    if (prop.typeName == client_sql_1.TypeName.ARRAY) {
        res.type.arguments = {
            type: {
                name: prop.argType,
                arguments: {
                    format: (_a = prop.argFormat) === null || _a === void 0 ? void 0 : _a.entityId,
                    language: prop.argLanguage,
                    properties: prop.argProperties.map(toPropertyInfo)
                }
            }
        };
    }
    else {
        res.type.arguments = {
            format: (_b = prop.argFormat) === null || _b === void 0 ? void 0 : _b.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo)
        };
    }
    return res;
}
exports.toPropertyInfo = toPropertyInfo;
function toFocusedStructure(structure) {
    return {
        entityId: structure.entityId,
        properties: structure.properties.map(toPropertyInfo),
        createdAt: toTimestamp(structure.createdAt)
    };
}
exports.toFocusedStructure = toFocusedStructure;
function toFocusedFormat(format) {
    return {
        entityId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: toRelatedSpace(format.space),
        generator: format.generator,
        usage: format.usage,
        createdAt: toTimestamp(format.createdAt),
        creatorUser: toRelatedUser(format.creatorUser),
        updatedAt: toTimestamp(format.updatedAt),
        updaterUser: toRelatedUser(format.updaterUser),
        structure: toFocusedStructure(format.currentStructure)
    };
}
exports.toFocusedFormat = toFocusedFormat;
function toFocusedFormatFromStructure(structure) {
    return {
        entityId: structure.format.entityId,
        displayId: structure.format.displayId,
        displayName: structure.format.displayName,
        description: structure.format.description,
        space: toRelatedSpace(structure.format.space),
        generator: structure.format.generator,
        usage: structure.format.usage,
        createdAt: toTimestamp(structure.format.createdAt),
        creatorUser: toRelatedUser(structure.format.creatorUser),
        updatedAt: toTimestamp(structure.format.updatedAt),
        updaterUser: toRelatedUser(structure.format.updaterUser),
        structure: toFocusedStructure(structure)
    };
}
exports.toFocusedFormatFromStructure = toFocusedFormatFromStructure;
function toFocusedContent(content, format, data) {
    return {
        entityId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        data: data
    };
}
exports.toFocusedContent = toFocusedContent;
function toFocusedMaterial(material, draft) {
    return {
        entityId: material.entityId,
        contentId: material.content.entityId,
        displayName: material.displayName,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser),
        data: material.data,
        draft: toRelatedMaterialDraft(draft)
    };
}
exports.toFocusedMaterial = toFocusedMaterial;
function toRelatedMaterial(material) {
    return {
        entityId: material.entityId,
        contentId: material.content.entityId,
        displayName: material.displayName,
        materialType: material.materialType,
        createdAt: toTimestamp(material.createdAt),
        creatorUser: toRelatedUser(material.creatorUser),
        updatedAt: toTimestamp(material.updatedAt),
        updaterUser: toRelatedUser(material.updaterUser)
    };
}
exports.toRelatedMaterial = toRelatedMaterial;
function toFocusedMaterialCommit(commit) {
    return {
        entityId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        data: commit.data,
        dataSize: commit.dataSize
    };
}
exports.toFocusedMaterialCommit = toFocusedMaterialCommit;
function toFocusedMaterialSnapshot(snapshot) {
    return {
        entityId: snapshot.entityId,
        timestamp: toTimestamp(snapshot.timestamp),
        data: snapshot.data,
        dataSize: snapshot.dataSize
    };
}
exports.toFocusedMaterialSnapshot = toFocusedMaterialSnapshot;
function toRelatedMaterialSnapshot(snapshot) {
    return {
        entityId: snapshot.entityId,
        timestamp: toTimestamp(snapshot.timestamp),
        dataSize: snapshot.dataSize
    };
}
exports.toRelatedMaterialSnapshot = toRelatedMaterialSnapshot;
var WorkNodeType;
(function (WorkNodeType) {
    WorkNodeType["COMMITTED"] = "committed";
    WorkNodeType["PRESENT"] = "present";
    WorkNodeType["CANCELD"] = "canceled";
})(WorkNodeType = exports.WorkNodeType || (exports.WorkNodeType = {}));
function toMaterialWorkNodes(editings, commits) {
    var editingDict = editings.reduce(function (prev, x) { return prev[x.id] = x; }, {});
    function fromEditing(editing) {
        var type;
        switch (editing.state) {
            case client_sql_1.EditingState.CANCELD:
                type = WorkNodeType.CANCELD;
                break;
            case client_sql_1.EditingState.EDITING:
                type = WorkNodeType.PRESENT;
                break;
            case client_sql_1.EditingState.COMMITTED:
                return null;
        }
        return {
            timestamp: toTimestamp(editing.startedAt),
            user: toRelatedUser(editing.user),
            editingId: editing.entityId,
            type: type
        };
    }
    function fromCommit(commit) {
        var _a;
        return {
            timestamp: toTimestamp(commit.timestamp),
            user: toRelatedUser(commit.committerUser),
            editingId: (_a = editingDict[commit.editingId]) === null || _a === void 0 ? void 0 : _a.entityId,
            type: WorkNodeType.COMMITTED
        };
    }
    return editings.map(fromEditing).filter(function (x) { return x; }) + commits.map(fromCommit);
    ;
}
exports.toMaterialWorkNodes = toMaterialWorkNodes;
function toRelatedMaterialCommit(commit) {
    return {
        entityId: commit.entityId,
        timestamp: toTimestamp(commit.timestamp),
        dataSize: commit.dataSize,
        forkedCommitId: commit.forkedCommit.entityId,
        committerUser: toRelatedUser(commit.committerUser)
    };
}
exports.toRelatedMaterialCommit = toRelatedMaterialCommit;
function toFocusedMaterialDraft(draft) {
    var _a;
    return {
        entityId: draft.entityId,
        displayName: draft.material ? draft.material.displayName : draft.intendedDisplayName,
        startedAt: toTimestamp(draft.startedAt),
        updatedAt: toTimestamp(draft.updatedAt),
        contentDraftId: (_a = draft.intendedContentDraft) === null || _a === void 0 ? void 0 : _a.entityId,
        material: toRelatedMaterial(draft.material),
        forkedCommitId: draft.forkedCommit.entityId,
        data: draft.data
    };
}
exports.toFocusedMaterialDraft = toFocusedMaterialDraft;
function toRelatedMaterialDraft(draft) {
    return {
        entityId: draft.entityId,
        displayName: draft.material ? draft.material.displayName : draft.intendedDisplayName,
        startedAt: toTimestamp(draft.startedAt),
        updatedAt: toTimestamp(draft.updatedAt),
    };
}
exports.toRelatedMaterialDraft = toRelatedMaterialDraft;
function toFocusedMaterialEditing(editing) {
    return {
        snapshots: editing.snapshots.map(toRelatedMaterialSnapshot)
    };
}
exports.toFocusedMaterialEditing = toFocusedMaterialEditing;
function toFocusedContentDraft() {
}
exports.toFocusedContentDraft = toFocusedContentDraft;
//# sourceMappingURL=utils_entities.js.map