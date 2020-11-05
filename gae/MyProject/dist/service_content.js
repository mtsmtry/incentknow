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
exports.ServiceContent = void 0;
var client_sql_1 = require("./client_sql");
var utils_base_1 = require("./utils_base");
var utils_authority_1 = require("./utils_authority");
var utils_entities_1 = require("./utils_entities");
var utils_format_1 = require("./utils_format");
var base = utils_base_1.UtilsBase;
var auth = utils_authority_1.UtilsSpaceAuthorization;
var formatUtils = utils_format_1.UtilsFormat;
var ServiceContent = /** @class */ (function () {
    function ServiceContent() {
    }
    ServiceContent._getChangeType = function (prevLength, length) {
        // 文字数で変更の種類を分類
        if (prevLength <= length) {
            return client_sql_1.ChangeType.WRITE;
        }
        else if (prevLength > length) {
            return client_sql_1.ChangeType.REMOVE;
        }
    };
    ServiceContent.startContentEditing = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, content, draft, forkedCommit, editing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.Content.findOne({ entityId: args.contentId })];
                    case 2:
                        content = _a.sent();
                        return [4 /*yield*/, client_sql_1.ContentDraft.findOne({ content: content })];
                    case 3:
                        draft = _a.sent();
                        if (!!draft) return [3 /*break*/, 5];
                        draft = client_sql_1.ContentDraft.create({
                            content: content,
                            user: user
                        });
                        return [4 /*yield*/, draft.save()];
                    case 4:
                        draft = _a.sent();
                        _a.label = 5;
                    case 5:
                        forkedCommit = null;
                        if (!args.forkedCommitId) return [3 /*break*/, 7];
                        return [4 /*yield*/, client_sql_1.ContentCommit.findOne({ entityId: args.forkedCommitId })];
                    case 6:
                        forkedCommit = _a.sent();
                        if (forkedCommit) {
                            if (forkedCommit.contentId != draft.content.id) {
                                throw "The content of the specified forked commit is not the specified content";
                            }
                        }
                        _a.label = 7;
                    case 7:
                        if (!!draft.currentEditing) return [3 /*break*/, 10];
                        editing = client_sql_1.ContentEditing.create({
                            draft: draft,
                            forkedCommit: forkedCommit,
                            user: user,
                            state: client_sql_1.EditingState.EDITING
                        });
                        return [4 /*yield*/, editing.save()];
                    case 8:
                        editing = _a.sent();
                        return [4 /*yield*/, client_sql_1.ContentDraft.update(draft, { currentEditing: editing })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/, toRelatedMaterialDraft(draft)];
                }
            });
        });
    };
    ServiceContent.startBlankContentEditing = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, draft, editing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        draft = client_sql_1.ContentDraft.create({
                            intendedMaterialType: args.type,
                            intendedDisplayName: args.displayName.split(" ").filter(function (x) { return x != ""; }).join(" "),
                            intendedSpace: args.space,
                            user: user
                        });
                        return [4 /*yield*/, draft.save()];
                    case 2:
                        draft = _a.sent();
                        editing = client_sql_1.MaterialEditing.create({
                            draft: draft,
                            user: user,
                            state: client_sql_1.EditingState.EDITING
                        });
                        return [4 /*yield*/, editing.save()];
                    case 3:
                        editing = _a.sent();
                        return [4 /*yield*/, MaterialDraft.update(draft, { currentEditing: editing })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, toRelatedMaterialDraft(draft)];
                }
            });
        });
    };
    ServiceContent.editMaterial = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, draft, changeType, snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, MaterialDraft.findOne({ entityId: args.materialDraftId })];
                    case 2:
                        draft = _a.sent();
                        if (!draft) {
                            throw "The specified material draft does not exists";
                        }
                        else if (!draft.currentEditingId) {
                            throw "The state of this material draft is not editing";
                        }
                        if (!(draft.data != args.data)) return [3 /*break*/, 6];
                        changeType = this._getChangeType(draft.data.length, args.data.length);
                        if (!(draft.changeType != client_sql_1.ChangeType.REMOVE && changeType == client_sql_1.ChangeType.REMOVE)) return [3 /*break*/, 4];
                        snapshot = client_sql_1.MaterialSnapshot.create({
                            editing: client_sql_1.MaterialEditing.create({ id: draft.currentEditingId }),
                            data: draft.data,
                            timestamp: draft.updatedAt
                        });
                        return [4 /*yield*/, Promise.all([
                                snapshot.save(),
                                MaterialDraft.update(draft, { data: args.data, changeType: changeType })
                            ])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, utils_entities_1.toRelatedMaterialSnapshot(snapshot)];
                    case 4: return [4 /*yield*/, MaterialDraft.update(draft, { data: args.data })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, {}];
                }
            });
        });
    };
    ServiceContent.commitMaterial = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, draft, commit, _, material, space, _;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _c.sent();
                        return [4 /*yield*/, MaterialDraft
                                .createQueryBuilder("editing")
                                .leftJoinAndSelect("draft.material", "material")
                                .leftJoinAndSelect("material.space", "space")
                                .leftJoinAndSelect("material.content", "content")
                                .leftJoinAndSelect("content1.container", "container1")
                                .leftJoinAndSelect("container1.space", "space1")
                                .leftJoinAndSelect("draft.intendedContentDraft", "intendedContentDraft")
                                .leftJoinAndSelect("intendedContentDraft.content", "content2")
                                .leftJoinAndSelect("content2.container", "container2")
                                .leftJoinAndSelect("container2.space", "space2")
                                .addSelect("draft.data")
                                .where("draft.entityId = :entityId")
                                .setParameter("entityId", args.materialDraftId)
                                .getOne()];
                    case 2:
                        draft = _c.sent();
                        if (draft.material.data == args.data) {
                            return [2 /*return*/, {}];
                        }
                        commit = MaterialCommit.create({
                            editing: client_sql_1.MaterialEditing.create({ id: draft.currentEditingId }),
                            forkedCommit: draft.forkedCommit,
                            data: args.data,
                            committerUser: user
                        });
                        if (!draft.material) return [3 /*break*/, 8];
                        if (!draft.material.space) return [3 /*break*/, 4];
                        return [4 /*yield*/, auth.checkSpaceAuth(user, draft.material.space, client_sql_1.SpaceAuth.WRITABLE)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, auth.checkSpaceAuth(user, draft.material.content.container.space, client_sql_1.SpaceAuth.WRITABLE)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        commit.material = draft.material;
                        _ = void 0;
                        return [4 /*yield*/, Promise.all([
                                commit.save(),
                                MaterialDraft.update(draft, { data: null, currentEditing: null }),
                                client_sql_1.MaterialEditing.update(draft.currentEditingId, { state: client_sql_1.EditingState.COMMITTED }),
                                client_sql_1.Material.update(draft.material, { data: args.data, updaterUser: user })
                            ])];
                    case 7:
                        _a = _c.sent(), commit = _a[0], _ = _a[1], _ = _a[2], _ = _a[3];
                        return [3 /*break*/, 18];
                    case 8:
                        material = client_sql_1.Material.create({
                            displayName: draft.intendedDisplayName,
                            materialType: draft.intendedMaterialType,
                            data: args.data,
                            creatorUser: user,
                            updaterUser: user
                        });
                        return [4 /*yield*/, material.save()];
                    case 9:
                        material = _c.sent();
                        if (!draft.intendedContentDraft) return [3 /*break*/, 13];
                        if (!draft.intendedContentDraft.content) return [3 /*break*/, 11];
                        space = draft.intendedContentDraft.content.container.space;
                        return [4 /*yield*/, auth.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.WRITABLE)];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 12];
                    case 11: throw "The parent content have not be committed";
                    case 12:
                        material.content = draft.intendedContentDraft.content;
                        return [3 /*break*/, 16];
                    case 13:
                        if (!draft.intendedSpace) return [3 /*break*/, 15];
                        // check auth
                        return [4 /*yield*/, auth.checkSpaceAuth(user, draft.intendedSpace, client_sql_1.SpaceAuth.WRITABLE)];
                    case 14:
                        // check auth
                        _c.sent();
                        material.space = draft.intendedSpace;
                        return [3 /*break*/, 16];
                    case 15: throw "Neither space nor content is specified";
                    case 16:
                        commit.material = material;
                        _ = void 0;
                        return [4 /*yield*/, Promise.all([
                                commit.save(),
                                MaterialDraft.update(draft, { data: null, currentEditing: null }),
                                client_sql_1.MaterialEditing.update(draft.currentEditingId, { state: client_sql_1.EditingState.COMMITTED }),
                            ])];
                    case 17:
                        _b = _c.sent(), commit = _b[0], _ = _b[1], _ = _b[2];
                        _c.label = 18;
                    case 18: return [2 /*return*/, { commitId: commit.entityId }];
                }
            });
        });
    };
    ServiceContent.getMaterial = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, material, draft;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.Material
                                .createQueryBuilder("material")
                                .leftJoinAndSelect("creatorUser", "creatorUser")
                                .leftJoinAndSelect("updaterUser", "updaterUser")
                                .where("material.entityId = :entityId")
                                .setParameter("entityId", args.materialId)
                                .addSelect("material.data")
                                .getOne()];
                    case 2:
                        material = _a.sent();
                        return [4 /*yield*/, MaterialDraft.findOne({ user: user, material: material })];
                    case 3:
                        draft = _a.sent();
                        return [2 /*return*/, utils_entities_1.toFocusedMaterial(material, draft)];
                }
            });
        });
    };
    ServiceContent.getMaterialDrafts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, drafts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, MaterialDraft
                                .createQueryBuilder("draft")
                                .where("draft.user = :user")
                                .setParameter("user", user)
                                .getMany()];
                    case 2:
                        drafts = _a.sent();
                        return [2 /*return*/, drafts.map(toRelatedMaterialDraft)];
                }
            });
        });
    };
    ServiceContent.getMaterialDraft = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, draft;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, MaterialDraft
                                .createQueryBuilder("draft")
                                .leftJoinAndSelect("draft.material", "material")
                                .leftJoinAndSelect("draft.intendedContentDraft", "intendedContentDraft")
                                .where("draft.entityId = :draftId")
                                .setParameter("draftId", args.draftId)
                                .getOne()];
                    case 2:
                        draft = _a.sent();
                        return [2 /*return*/, toFocusedMaterialDraft(draft)];
                }
            });
        });
    };
    ServiceContent.getMaterialCommits = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, commits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, MaterialCommit
                                .createQueryBuilder("commit")
                                .leftJoinAndSelect("commit.material", "material")
                                .leftJoinAndSelect("commit.forkedCommit", "forkedCommit")
                                .leftJoinAndSelect("commit.committerUser", "committerUser")
                                .where("material.entityId = :materialId")
                                .setParameter("materialId", args.materialId)
                                .getMany()];
                    case 2:
                        commits = _a.sent();
                        return [2 /*return*/, commits.map(toRelatedMaterialCommit)];
                }
            });
        });
    };
    // include snapshot
    ServiceContent.getMaterialEditing = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, editing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.MaterialEditing.findOne({ entityId: args.editingId })];
                    case 2:
                        editing = _a.sent();
                        if (!editing) {
                            return [2 /*return*/, utils_entities_1.toFocusedMaterialEditing(editing)];
                        }
                        else {
                            return [2 /*return*/, { snapshots: [] }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceContent.getMaterialSnapshot = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_sql_1.MaterialSnapshot.findOne({ entityId: args.snapshotId }, { select: ["data"] })];
                    case 1:
                        snapshot = _a.sent();
                        return [2 /*return*/, utils_entities_1.toFocusedMaterialSnapshot(snapshot)];
                }
            });
        });
    };
    ServiceContent.getMaterialCommit = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var commit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MaterialCommit.findOne({ entityId: args.commitId }, { select: ["data"] })];
                    case 1:
                        commit = _a.sent();
                        return [2 /*return*/, toFocusedMaterialCommit(commit)];
                }
            });
        });
    };
    return ServiceContent;
}());
exports.ServiceContent = ServiceContent;
//# sourceMappingURL=service_content.js.map