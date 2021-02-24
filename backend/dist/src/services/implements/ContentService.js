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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.ContentService = exports.MaterialComposition = exports.MaterialCompositionType = void 0;
var Space_1 = require("../../entities/space/Space");
var Implication_1 = require("../../Implication");
var ContentRevision_1 = require("../../interfaces/content/ContentRevision");
var utils_1 = require("../../utils");
var BaseService_1 = require("../BaseService");
var Errors_1 = require("../Errors");
var MaterialCompositionType;
(function (MaterialCompositionType) {
    MaterialCompositionType["CREATION"] = "creation";
    MaterialCompositionType["MOVE"] = "move";
})(MaterialCompositionType = exports.MaterialCompositionType || (exports.MaterialCompositionType = {}));
var MaterialComposition = /** @class */ (function () {
    function MaterialComposition() {
    }
    __decorate([
        Implication_1.DataKind(),
        __metadata("design:type", String)
    ], MaterialComposition.prototype, "type", void 0);
    __decorate([
        Implication_1.DataMember([MaterialCompositionType.CREATION, MaterialCompositionType.CREATION]),
        __metadata("design:type", String)
    ], MaterialComposition.prototype, "propertyId", void 0);
    __decorate([
        Implication_1.DataMember([MaterialCompositionType.MOVE]),
        __metadata("design:type", String)
    ], MaterialComposition.prototype, "materialId", void 0);
    __decorate([
        Implication_1.DataMember([MaterialCompositionType.CREATION]),
        __metadata("design:type", String)
    ], MaterialComposition.prototype, "data", void 0);
    MaterialComposition = __decorate([
        Implication_1.Data()
    ], MaterialComposition);
    return MaterialComposition;
}());
exports.MaterialComposition = MaterialComposition;
var ContentService = /** @class */ (function (_super) {
    __extends(ContentService, _super);
    function ContentService(ctx, con, edit, com, rev, mat, matEdit, matRev, spaces, containers, formats, auth) {
        var _this = _super.call(this, ctx) || this;
        _this.con = con;
        _this.edit = edit;
        _this.com = com;
        _this.rev = rev;
        _this.mat = mat;
        _this.matEdit = matEdit;
        _this.matRev = matRev;
        _this.spaces = spaces;
        _this.containers = containers;
        _this.formats = formats;
        _this.auth = auth;
        return _this;
    }
    ContentService.prototype._getFocusedContentDraftWhole = function (qb) {
        return __awaiter(this, void 0, void 0, function () {
            var getAttributedMaterialDrafts, getMaterialDrafts, _a, buildDraft, draftRaw, _b, materialDrafts1, materialDrafts2;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        getAttributedMaterialDrafts = function (contentId) { return __awaiter(_this, void 0, void 0, function () {
                            var materials, materialMap, materialDrafts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!contentId) {
                                            return [2 /*return*/, []];
                                        }
                                        return [4 /*yield*/, this.mat.fromMaterials().byContent(contentId).selectRelated().getManyWithRaw()];
                                    case 1:
                                        materials = _a.sent();
                                        materialMap = utils_1.mapBy(materials, function (x) { return x.raw.id; });
                                        return [4 /*yield*/, this.matEdit.fromDrafts().byMaterials(materials.map(function (x) { return x.raw.id; })).selectFocused().getManyWithRaw()];
                                    case 2:
                                        materialDrafts = _a.sent();
                                        return [2 /*return*/, materialDrafts.map(function (x) { return x.result ? x.result(materialMap[x.raw.id].result) : null; }).filter(utils_1.notNull)];
                                }
                            });
                        }); };
                        getMaterialDrafts = function (draftId) { return __awaiter(_this, void 0, void 0, function () {
                            var materialDrafts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.matEdit.fromDrafts().byIntendedContentDraft(draftId).selectFocused().getMany()];
                                    case 1:
                                        materialDrafts = _a.sent();
                                        return [2 /*return*/, materialDrafts.filter(utils_1.notNull).map(function (x) { return x(null); })];
                                }
                            });
                        }); };
                        return [4 /*yield*/, qb.selectFocused().getOneWithRaw()];
                    case 1:
                        _a = _c.sent(), buildDraft = _a[0], draftRaw = _a[1];
                        if (!buildDraft || !draftRaw) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, Promise.all([
                                getAttributedMaterialDrafts(draftRaw.contentId),
                                getMaterialDrafts(draftRaw.id)
                            ])];
                    case 2:
                        _b = _c.sent(), materialDrafts1 = _b[0], materialDrafts2 = _b[1];
                        return [2 /*return*/, buildDraft(materialDrafts1.concat(materialDrafts2))];
                }
            });
        });
    };
    ContentService.prototype._getFocusedRevisionById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var strc, contentPromise, materialPromises, _a, buildContent, materials;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        strc = ContentRevision_1.toContentWholeRevisionStructure(id);
                        return [4 /*yield*/, this.rev.fromRevisions().getFocusedOneById(strc.content)];
                    case 1:
                        contentPromise = _b.sent();
                        materialPromises = Promise.all(strc.materials.map(function (id) { return _this.matRev.fromRevisions().getFocusedOneById(id); }));
                        return [4 /*yield*/, Promise.all([contentPromise, materialPromises])];
                    case 2:
                        _a = _b.sent(), buildContent = _a[0], materials = _a[1];
                        return [2 /*return*/, buildContent ? buildContent(materials.filter(utils_1.notNull)) : null];
                }
            });
        });
    };
    ContentService.prototype.startContentEditing = function (contentId, basedCommitId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var contentSk, basedCommit, _a, draft;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.con.fromContents(trx).byEntityId(contentId).selectId().getNeededOne()];
                                    case 1:
                                        contentSk = _b.sent();
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
                                        return [4 /*yield*/, this.edit.createCommand(trx).getOrCreateActiveDraft(userId, contentSk, basedCommit)];
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
    ContentService.prototype.startBlankContentEditing = function (spaceId) {
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
                                        return [4 /*yield*/, this.edit.createCommand(trx).getOrCreateActiveBlankDraft(userId, spaceSk)];
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
    ContentService.prototype.editContent = function (contentDraftId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var draft;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.edit.fromDrafts().byEntityId(contentDraftId).getNeededOne()];
                                    case 1:
                                        draft = _a.sent();
                                        if (!draft.currentEditingId) {
                                            throw new Errors_1.WrongTargetState("The state of this material draft is not editing");
                                        }
                                        return [4 /*yield*/, this.edit.createCommand(trx).updateDraft(draft, data)];
                                    case 2:
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
    ContentService.prototype.commitContent = function (contentDraftId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var draft, editing, _a, format, structure, _b, auth, material, _c, auth, _, container, material;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, this.edit.fromDrafts().byEntityId(contentDraftId).getNeededOne()];
                                    case 1:
                                        draft = _d.sent();
                                        if (!draft.currentEditingId || !draft.data) {
                                            throw new Errors_1.WrongTargetState();
                                        }
                                        return [4 /*yield*/, this.edit.fromEditings().byId(draft.currentEditingId).getNeededOne()];
                                    case 2:
                                        editing = _d.sent();
                                        return [4 /*yield*/, this.formats.fromStructures(trx).byId(draft.structureId).selectFocusedFormat().getNeededOneWithRaw()];
                                    case 3:
                                        _a = _d.sent(), format = _a[0], structure = _a[1];
                                        if (!draft.contentId) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this.auth.fromAuths(trx).getContentAuth(Space_1.SpaceAuth.WRITABLE, userId, draft.contentId)];
                                    case 4:
                                        _b = _d.sent(), auth = _b[0], material = _b[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, Promise.all([
                                                this.edit.createCommand(trx).commitEditing(draft),
                                                this.com.createCommand(trx).commitContent(userId, draft.contentId, draft.data, editing.basedCommitId, draft.currentEditingId),
                                                this.con.createCommand(trx).updateContent(userId, draft.contentId, draft.data)
                                            ])];
                                    case 5:
                                        _d.sent();
                                        return [3 /*break*/, 11];
                                    case 6:
                                        if (!draft.intendedSpaceId) return [3 /*break*/, 11];
                                        if (!draft.data) {
                                            throw new Errors_1.WrongTargetState();
                                        }
                                        return [4 /*yield*/, this.auth.fromAuths(trx).getSpaceAuth(Space_1.SpaceAuth.WRITABLE, userId, draft.intendedSpaceId)];
                                    case 7:
                                        _c = _d.sent(), auth = _c[0], _ = _c[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, this.containers.fromContainers(trx).bySpaceAndFormat(draft.intendedSpaceId, structure.formatId).getNeededOne()];
                                    case 8:
                                        container = _d.sent();
                                        return [4 /*yield*/, this.con.createCommand(trx).createContent(container.id, draft.structureId, userId, draft.data)];
                                    case 9:
                                        material = _d.sent();
                                        return [4 /*yield*/, Promise.all([
                                                this.edit.createCommand(trx).commitEditing(draft),
                                                this.com.createCommand(trx).commitContent(userId, material.raw.id, draft.data, editing.basedCommitId, draft.currentEditingId),
                                                this.con.createCommand(trx).updateContent(userId, material.raw.id, draft.data)
                                            ])];
                                    case 10:
                                        _d.sent();
                                        _d.label = 11;
                                    case 11: throw new Errors_1.InternalError();
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentService.prototype.getContent = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, buildContent, rawContent, draft, format;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.con.fromContents().byEntityId(contentId).selectFocused().getNeededOneWithRaw()];
                    case 1:
                        _a = _b.sent(), buildContent = _a[0], rawContent = _a[1];
                        return [4 /*yield*/, this.edit.fromDrafts().byUser(userId).byContent(rawContent.id).selectRelated().getNeededOne()];
                    case 2:
                        draft = _b.sent();
                        return [4 /*yield*/, this.formats.fromStructures().byId(rawContent.structureId).selectFocusedFormat().getNeededOne()];
                    case 3:
                        format = _b.sent();
                        return [2 /*return*/, buildContent(format, draft)];
                }
            });
        });
    };
    ContentService.prototype.getMyContentDrafts = function () {
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
    ContentService.prototype.getContentDraft = function (draftId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, draft;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this._getFocusedContentDraftWhole(this.edit.fromDrafts().byEntityId(draftId))];
                    case 1:
                        draft = _a.sent();
                        if (!draft) {
                            throw new Errors_1.NotFoundEntity();
                        }
                        return [2 /*return*/, draft];
                }
            });
        });
    };
    ContentService.prototype.getContentCommits = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, auth, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.auth.fromAuths().getContentAuth(Space_1.SpaceAuth.READABLE, userId, contentId)];
                    case 1:
                        _a = _b.sent(), auth = _a[0], content = _a[1];
                        return [4 /*yield*/, this.com.fromCommits().byContent(content.id).selectRelated().getMany()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    // include snapshot
    ContentService.prototype.getContentEditingNodes = function (draftId) {
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
                        return [2 /*return*/, []]; //return await this.rev.fromNodes().getManyByDraft(draft.id);
                }
            });
        });
    };
    ContentService.prototype.getContentRevision = function (revisionId) {
        return __awaiter(this, void 0, void 0, function () {
            var revision;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getFocusedRevisionById(revisionId)];
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
    ContentService.prototype.getContentCommit = function (commitId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.com.fromCommits().byEntityId(commitId).selectFocused().getNeededOne()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ContentService;
}(BaseService_1.BaseService));
exports.ContentService = ContentService;
//# sourceMappingURL=ContentService.js.map