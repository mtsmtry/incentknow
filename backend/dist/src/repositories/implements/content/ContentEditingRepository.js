"use strict";
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
exports.ContentEditingCommand = exports.ContentEditingRepository = void 0;
var ContentDraft_1 = require("../../../entities/content/ContentDraft");
var ContentEditing_1 = require("../../../entities/content/ContentEditing");
var ContentDraftQuery_1 = require("../../queries/content/ContentDraftQuery");
var ContentEditing_2 = require("../../queries/content/ContentEditing");
function getChangeType(prevLength, length) {
    // 文字数で変更の種類を分類
    if (prevLength <= length) {
        return ContentDraft_1.ContentChangeType.WRITE;
    }
    else if (prevLength > length) {
        return ContentDraft_1.ContentChangeType.REMOVE;
    }
}
var ContentEditingRepository = /** @class */ (function () {
    function ContentEditingRepository(drafts, editings, snapshots) {
        this.drafts = drafts;
        this.editings = editings;
        this.snapshots = snapshots;
    }
    ContentEditingRepository.prototype.fromDrafts = function (trx) {
        return new ContentDraftQuery_1.ContentDraftQuery(this.drafts.createQuery(trx));
    };
    ContentEditingRepository.prototype.fromEditings = function (trx) {
        return new ContentEditing_2.ContentEditingQuery(this.editings.createQuery(trx));
    };
    ContentEditingRepository.prototype.createCommand = function (trx) {
        return new ContentEditingCommand(this.drafts.createCommand(trx), this.editings.createCommand(trx), this.snapshots.createCommand(trx));
    };
    return ContentEditingRepository;
}());
exports.ContentEditingRepository = ContentEditingRepository;
var ContentEditingCommand = /** @class */ (function () {
    function ContentEditingCommand(drafts, editings, snapshots) {
        this.drafts = drafts;
        this.editings = editings;
        this.snapshots = snapshots;
    }
    ContentEditingCommand.prototype.getOrCreateActiveDraft = function (userId, contentId, basedCommit) {
        return __awaiter(this, void 0, void 0, function () {
            var draft, editing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // validate basedCommit
                        if (basedCommit && basedCommit.contentId != contentId) {
                            throw "The content of the specified forked commit is not the specified content";
                        }
                        return [4 /*yield*/, this.drafts.findOne({ contentId: contentId })];
                    case 1:
                        draft = _a.sent();
                        if (!!draft) return [3 /*break*/, 3];
                        draft = this.drafts.create({ contentId: contentId, userId: userId, updatedAtOnlyContent: new Date() });
                        return [4 /*yield*/, this.drafts.save(draft)];
                    case 2:
                        draft = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!draft.currentEditing) return [3 /*break*/, 6];
                        editing = this.editings.create({
                            draftId: draft.id,
                            basedCommitId: basedCommit === null || basedCommit === void 0 ? void 0 : basedCommit.id,
                            userId: userId,
                            state: ContentEditing_1.ContentEditingState.EDITING
                        });
                        return [4 /*yield*/, this.editings.save(editing)];
                    case 4:
                        editing = _a.sent();
                        return [4 /*yield*/, this.drafts.update(draft, { currentEditingId: editing.id })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, new ContentDraftQuery_1.ContentDraftQueryFromEntity(draft)];
                }
            });
        });
    };
    ContentEditingCommand.prototype.getOrCreateActiveBlankDraft = function (userId, spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var draft, editing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        draft = this.drafts.create({
                            intendedSpaceId: spaceId,
                            userId: userId
                        });
                        return [4 /*yield*/, this.drafts.save(draft)];
                    case 1:
                        draft = _a.sent();
                        editing = this.editings.create({
                            draftId: draft.id,
                            userId: userId,
                            state: ContentEditing_1.ContentEditingState.EDITING
                        });
                        return [4 /*yield*/, this.editings.save(editing)];
                    case 2:
                        editing = _a.sent();
                        // set editing to draft
                        return [4 /*yield*/, this.drafts.update(draft, { currentEditing: editing })];
                    case 3:
                        // set editing to draft
                        _a.sent();
                        return [2 /*return*/, new ContentDraftQuery_1.ContentDraftQueryFromEntity(draft)];
                }
            });
        });
    };
    ContentEditingCommand.prototype.updateDraft = function (draft, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var changeType, snapshot;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (draft.data == data) {
                            return [2 /*return*/, null];
                        }
                        if (!draft.currentEditingId) {
                            throw "This draft is not active";
                        }
                        if (!draft.data) return [3 /*break*/, 2];
                        changeType = getChangeType((_a = draft.data) === null || _a === void 0 ? void 0 : _a.length, data.length);
                        if (!(draft.changeType != ContentDraft_1.ContentChangeType.REMOVE && changeType == ContentDraft_1.ContentChangeType.REMOVE)) return [3 /*break*/, 2];
                        snapshot = this.snapshots.create({
                            editingId: draft.currentEditingId,
                            data: draft.data,
                            timestamp: draft.updatedAt
                        });
                        return [4 /*yield*/, Promise.all([
                                this.snapshots.save(snapshot),
                                this.drafts.update(draft, { data: data, changeType: changeType, updatedAtOnlyContent: new Date() })
                            ])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, snapshot];
                    case 2: return [4 /*yield*/, this.drafts.update(draft, { data: data })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ContentEditingCommand.prototype.cancelEditing = function (draft) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.drafts.update(draft, { data: null, currentEditingId: null }),
                            this.editings.update(draft.currentEditingId, { state: ContentEditing_1.ContentEditingState.CANCELD })
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentEditingCommand.prototype.commitEditing = function (draft) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.drafts.update(draft, { data: null, currentEditingId: null }),
                            this.editings.update(draft.currentEditingId, { state: ContentEditing_1.ContentEditingState.COMMITTED })
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentEditingCommand.prototype.updateDraftTimestamp = function (draftId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.drafts.update(draftId, {
                            updatedAt: new Date()
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ContentEditingCommand;
}());
exports.ContentEditingCommand = ContentEditingCommand;
//# sourceMappingURL=ContentEditingRepository.js.map