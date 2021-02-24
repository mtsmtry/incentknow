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
exports.ContentRivisionQuery = void 0;
var ContentRevision_1 = require("../../../interfaces/content/ContentRevision");
/*
    1. 全てのコンテンツのRivisionを取得する
    2. コンテンツの各Rivisionが内包するMaterialのそのコンテンツのRivisionのTimestamp以前のRivisionを取得する
    3. 両者を時系列で統合する
*/
var ContentRivisionQuery = /** @class */ (function () {
    function ContentRivisionQuery(drafts, editing, snapshots, commits) {
        this.drafts = drafts;
        this.editing = editing;
        this.snapshots = snapshots;
        this.commits = commits;
    }
    ContentRivisionQuery.prototype.getFocusedOneById = function (src) {
        return __awaiter(this, void 0, void 0, function () {
            var strc, _a, snapshot_1, commit_1, draft_1, data_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        strc = ContentRevision_1.toContentRevisionStructure(src);
                        _a = strc.source;
                        switch (_a) {
                            case ContentRevision_1.ContentRevisionSource.SNAPSHOT: return [3 /*break*/, 1];
                            case ContentRevision_1.ContentRevisionSource.COMMIT: return [3 /*break*/, 3];
                            case ContentRevision_1.ContentRevisionSource.DRAFT: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.snapshots.where({ entityId: strc.entityId }).addSelect("data").getOne()];
                    case 2:
                        snapshot_1 = _b.sent();
                        return [2 /*return*/, snapshot_1 ? function (m) { return ContentRevision_1.toFocusedContentRevisionFromSnapshot(snapshot_1, m); } : null];
                    case 3: return [4 /*yield*/, this.commits.where({ entityId: strc.entityId }).addSelect("data").getOne()];
                    case 4:
                        commit_1 = _b.sent();
                        return [2 /*return*/, commit_1 ? function (m) { return ContentRevision_1.toFocusedContentRevisionFromCommit(commit_1, m); } : null];
                    case 5: return [4 /*yield*/, this.drafts.where({ entityId: strc.entityId }).addSelect("data").getOne()];
                    case 6:
                        draft_1 = _b.sent();
                        data_1 = draft_1 === null || draft_1 === void 0 ? void 0 : draft_1.data;
                        return [2 /*return*/, draft_1 && data_1 ? function (m) { return ContentRevision_1.toFocusedContentRevisionFromDraft(draft_1, data_1, m); } : null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ContentRivisionQuery;
}());
exports.ContentRivisionQuery = ContentRivisionQuery;
//# sourceMappingURL=ContentRevisionQuery.js.map