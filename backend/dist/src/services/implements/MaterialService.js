"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialService = void 0;
var MaterialEditing_1 = require("../../entities/material/MaterialEditing");
var Space_1 = require("../../entities/space/Space");
var BaseService_1 = require("../BaseService");
var Errors_1 = require("../Errors");
var MaterialService = /** @class */ (function (_super) {
    __extends(MaterialService, _super);
    function MaterialService(ctx, mat, edit, rev, com, contents, contentEdit, spaces, auth) {
        var _this = _super.call(this, ctx) || this;
        _this.mat = mat;
        _this.edit = edit;
        _this.rev = rev;
        _this.com = com;
        _this.contents = contents;
        _this.contentEdit = contentEdit;
        _this.spaces = spaces;
        _this.auth = auth;
        return _this;
    }
    MaterialService.prototype.startMaterialEditing = function (materialId, basedCommitId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var materialSk, basedCommit, _a, draft;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.mat.fromMaterials(trx).byEntityId(materialId).selectId().getNeededOne()];
                                    case 1:
                                        materialSk = _b.sent();
                                        if (!basedCommitId) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.com.fromCommits(trx).byEntityId(basedCommitId).getNeededOne()];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = null;
                                        _b.label = 4;
                                    case 4:
                                        basedCommit = _a;
                                        return [4 /*yield*/, this.edit.createCommand(trx).getOrCreateActiveDraft(userId, materialSk, basedCommit)];
                                    case 5:
                                        draft = _b.sent();
                                        return [4 /*yield*/, draft.getRelated()];
                                    case 6: return [2 /*return*/, _b.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.startBlankMaterialEditing = function (spaceId, type) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var spaceSk, draft;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.spaces.fromSpaces(trx).byEntityId(spaceId).selectId().getNeededOne()];
                                    case 1:
                                        spaceSk = _a.sent();
                                        return [4 /*yield*/, this.edit.createCommand(trx).getOrCreateActiveBlankDraft(userId, spaceSk, type)];
                                    case 2:
                                        draft = _a.sent();
                                        return [4 /*yield*/, draft.getRelated()];
                                    case 3: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.editMaterial = function (materialDraftId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var draft;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.edit.fromDrafts().byEntityId(materialDraftId).getNeededOne()];
                                    case 1:
                                        draft = _a.sent();
                                        if (!draft.currentEditingId) {
                                            throw new Errors_1.WrongTargetState("The state of this material draft is not editing");
                                        }
                                        if (!draft.intendedContentDraftId) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.contentEdit.createCommand(trx).updateDraftTimestamp(draft.intendedContentDraftId)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [4 /*yield*/, this.edit.createCommand(trx).updateDraft(draft, data)];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, null];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.commitMaterial = function (materialDraftId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var draft, editing, _a, auth, material, _b, auth, _, material;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, this.edit.fromDrafts().byEntityId(materialDraftId).getNeededOne()];
                                    case 1:
                                        draft = _c.sent();
                                        if (!draft.currentEditingId || !draft.data) {
                                            throw new Errors_1.WrongTargetState();
                                        }
                                        return [4 /*yield*/, this.edit.fromEditings().byId(draft.currentEditingId).getNeededOne()];
                                    case 2:
                                        editing = _c.sent();
                                        if (!draft.materialId) return [3 /*break*/, 7];
                                        return [4 /*yield*/, this.auth.fromAuths(trx).getMaterialAuth(Space_1.SpaceAuth.WRITABLE, userId, draft.materialId)];
                                    case 3:
                                        _a = _c.sent(), auth = _a[0], material = _a[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        if (!material.contentId) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.contents.createCommand(trx).updateContentTimestamp(material.contentId)];
                                    case 4:
                                        _c.sent();
                                        _c.label = 5;
                                    case 5: return [4 /*yield*/, Promise.all([
                                            this.edit.createCommand(trx).closeEditing(draft, MaterialEditing_1.MaterialEditingState.COMMITTED),
                                            this.com.createCommand(trx).commitMaterial(userId, draft.materialId, draft.data, editing.basedCommitId, draft.currentEditingId),
                                            this.mat.createCommand(trx).updateMaterial(userId, draft.materialId, draft.data)
                                        ])];
                                    case 6:
                                        _c.sent();
                                        return [3 /*break*/, 11];
                                    case 7:
                                        if (!(draft.intendedSpaceId && draft.intendedMaterialType)) return [3 /*break*/, 11];
                                        if (!draft.data) {
                                            throw new Errors_1.WrongTargetState();
                                        }
                                        return [4 /*yield*/, this.auth.fromAuths(trx).getSpaceAuth(Space_1.SpaceAuth.WRITABLE, userId, draft.intendedSpaceId)];
                                    case 8:
                                        _b = _c.sent(), auth = _b[0], _ = _b[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, this.mat.createCommand(trx).createMaterialInSpace(draft.intendedSpaceId, userId, draft.data, draft.intendedMaterialType)];
                                    case 9:
                                        material = _c.sent();
                                        return [4 /*yield*/, Promise.all([
                                                this.edit.createCommand(trx).closeEditing(draft, MaterialEditing_1.MaterialEditingState.COMMITTED),
                                                this.com.createCommand(trx).commitMaterial(userId, material.raw.id, draft.data, editing.basedCommitId, draft.currentEditingId),
                                                this.mat.createCommand(trx).updateMaterial(userId, material.raw.id, draft.data)
                                            ])];
                                    case 10:
                                        _c.sent();
                                        _c.label = 11;
                                    case 11: throw new Errors_1.InternalError();
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.getMaterial = function (materialId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, buildMaterial, rawMaterial, draft;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.mat.fromMaterials().byEntityId(materialId).selectFocused().getNeededOneWithRaw()];
                    case 1:
                        _a = _b.sent(), buildMaterial = _a[0], rawMaterial = _a[1];
                        return [4 /*yield*/, this.edit.fromDrafts().byUser(userId).byMaterial(rawMaterial.id).selectRelated().getNeededOne()];
                    case 2:
                        draft = _b.sent();
                        return [2 /*return*/, buildMaterial(draft)];
                }
            });
        });
    };
    MaterialService.prototype.getMyMaterialDrafts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.edit.fromDrafts().byUser(userId).selectRelated().getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.getMaterialDraft = function (draftId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, buildDraft, rawDraft, material, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.edit.fromDrafts().byEntityId(draftId).selectFocused().getNeededOneWithRaw()];
                    case 1:
                        _a = _c.sent(), buildDraft = _a[0], rawDraft = _a[1];
                        if (!buildDraft) {
                            throw new Errors_1.WrongTargetState();
                        }
                        if (rawDraft.userId != userId) {
                            throw new Errors_1.LackOfAuthority();
                        }
                        if (!rawDraft.materialId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.mat.fromMaterials().byId(rawDraft.materialId).selectRelated().getOne()];
                    case 2:
                        _b = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _b = null;
                        _c.label = 4;
                    case 4:
                        material = _b;
                        return [2 /*return*/, buildDraft(material)];
                }
            });
        });
    };
    MaterialService.prototype.getMaterialCommits = function (materialId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, material, space;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.mat.fromMaterials().byEntityId(materialId).getNeededOne()];
                    case 1:
                        material = _a.sent();
                        if (!material.spaceId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.spaces.fromSpaces().byId(material.spaceId).getNeededOne()];
                    case 2:
                        space = _a.sent();
                        return [4 /*yield*/, this.auth.fromAuths().getSpaceAuthByEntity(Space_1.SpaceAuth.READABLE, userId, space)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.com.fromCommits().byMaterial(material.id).selectRelated().getMany()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.getMaterialEditingNodes = function (draftId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, draft;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.edit.fromDrafts().byEntityId(draftId).getNeededOne()];
                    case 1:
                        draft = _a.sent();
                        if (draft.userId != userId) {
                            throw new Errors_1.LackOfAuthority();
                        }
                        return [4 /*yield*/, this.rev.fromNodes().getManyByDraft(draft.id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MaterialService.prototype.getMaterialRevision = function (revisionId) {
        return __awaiter(this, void 0, void 0, function () {
            var revision;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rev.fromRevisions().getFocusedOneById(revisionId)];
                    case 1:
                        revision = _a.sent();
                        if (!revision) {
                            throw new Errors_1.NotFoundEntity();
                        }
                        return [2 /*return*/, revision];
                }
            });
        });
    };
    MaterialService.prototype.getMaterialCommit = function (commitId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.com.fromCommits().byEntityId(commitId).selectFocused().getNeededOne()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MaterialService;
}(BaseService_1.BaseService));
exports.MaterialService = MaterialService;
//# sourceMappingURL=MaterialService.js.map