"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedMaterialDraft = exports.toRelatedMaterialDraft = void 0;
var Utils_1 = require("../Utils");
function toRelatedMaterialDraft(draft) {
    var _a;
    return {
        draftId: draft.entityId,
        displayName: ((_a = draft.material) === null || _a === void 0 ? void 0 : _a.beginning) || draft.beginning || "",
        createdAt: Utils_1.toTimestamp(draft.createdAt),
        updatedAt: Utils_1.toTimestamp(draft.updatedAt),
    };
}
exports.toRelatedMaterialDraft = toRelatedMaterialDraft;
function toFocusedMaterialDraft(draft, data, material) {
    var _a, _b, _c, _d;
    return {
        draftId: draft.entityId,
        displayName: ((_a = draft.material) === null || _a === void 0 ? void 0 : _a.beginning) || draft.beginning || "",
        createdAt: Utils_1.toTimestamp(draft.createdAt),
        updatedAt: Utils_1.toTimestamp(draft.updatedAt),
        contentDraftId: ((_b = draft.intendedContentDraft) === null || _b === void 0 ? void 0 : _b.entityId) || null,
        material: material,
        basedCommitId: ((_d = (_c = draft.currentEditing) === null || _c === void 0 ? void 0 : _c.basedCommit) === null || _d === void 0 ? void 0 : _d.entityId) || null,
        data: data
    };
}
exports.toFocusedMaterialDraft = toFocusedMaterialDraft;
//# sourceMappingURL=MaterialDraft.js.map