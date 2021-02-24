"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedContentDraft = exports.toRelatedContentDraft = void 0;
var Format_1 = require("../format/Format");
var Utils_1 = require("../Utils");
function toRelatedContentDraft(draft) {
    var _a, _b, _c;
    return {
        draftId: draft.entityId,
        createdAt: Utils_1.toTimestamp(draft.createdAt),
        updatedAt: Utils_1.toTimestamp(draft.updatedAt),
        basedCommitId: ((_a = draft.currentEditing) === null || _a === void 0 ? void 0 : _a.basedCommit) ? (_c = (_b = draft.currentEditing) === null || _b === void 0 ? void 0 : _b.basedCommit) === null || _c === void 0 ? void 0 : _c.entityId : null,
        data: draft.data,
        format: Format_1.toFocusedFormatFromStructure(draft.structure)
    };
}
exports.toRelatedContentDraft = toRelatedContentDraft;
function toFocusedContentDraft(draft, data, materialDrafts) {
    var _a, _b, _c;
    return {
        draftId: draft.entityId,
        createdAt: Utils_1.toTimestamp(draft.createdAt),
        updatedAt: Utils_1.toTimestamp(draft.updatedAt),
        basedCommitId: ((_a = draft.currentEditing) === null || _a === void 0 ? void 0 : _a.basedCommit) ? (_c = (_b = draft.currentEditing) === null || _b === void 0 ? void 0 : _b.basedCommit) === null || _c === void 0 ? void 0 : _c.entityId : null,
        data: data,
        materialDrafts: materialDrafts
    };
}
exports.toFocusedContentDraft = toFocusedContentDraft;
//# sourceMappingURL=ContentDraft.js.map