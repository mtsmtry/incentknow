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
exports.AuthorityQuery = void 0;
var util_1 = require("util");
var Space_1 = require("../../../entities/space/Space");
var Errors_1 = require("../../../services/Errors");
var AuthorityQuery = /** @class */ (function () {
    function AuthorityQuery(spaces, members, contents, materials) {
        this.spaces = spaces;
        this.members = members;
        this.contents = contents;
        this.materials = materials;
    }
    AuthorityQuery.prototype.getSpaceAuthByEntity = function (auth, userId, space) {
        return __awaiter(this, void 0, void 0, function () {
            var belongSpace, _a, _b, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        belongSpace = function () { return __awaiter(_this, void 0, void 0, function () {
                            var member;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!userId) {
                                            return [2 /*return*/, false];
                                        }
                                        return [4 /*yield*/, this.members.where({ userId: userId, spaceId: space.id }).getOne()];
                                    case 1:
                                        member = _a.sent();
                                        return [2 /*return*/, Boolean(member)];
                                }
                            });
                        }); };
                        _a = auth;
                        switch (_a) {
                            case Space_1.SpaceAuth.NONE: return [3 /*break*/, 1];
                            case Space_1.SpaceAuth.VISIBLE: return [3 /*break*/, 2];
                            case Space_1.SpaceAuth.READABLE: return [3 /*break*/, 6];
                            case Space_1.SpaceAuth.WRITABLE: return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 14];
                    case 1: return [2 /*return*/, true];
                    case 2:
                        _b = space.defaultAuthority;
                        switch (_b) {
                            case Space_1.SpaceAuth.NONE: return [3 /*break*/, 3];
                            case Space_1.SpaceAuth.VISIBLE: return [3 /*break*/, 5];
                            case Space_1.SpaceAuth.READABLE: return [3 /*break*/, 5];
                            case Space_1.SpaceAuth.WRITABLE: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, belongSpace()];
                    case 4: return [2 /*return*/, _e.sent()];
                    case 5: return [2 /*return*/, true];
                    case 6:
                        _c = space.defaultAuthority;
                        switch (_c) {
                            case Space_1.SpaceAuth.NONE: return [3 /*break*/, 7];
                            case Space_1.SpaceAuth.VISIBLE: return [3 /*break*/, 7];
                            case Space_1.SpaceAuth.READABLE: return [3 /*break*/, 9];
                            case Space_1.SpaceAuth.WRITABLE: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, belongSpace()];
                    case 8: return [2 /*return*/, _e.sent()];
                    case 9: return [2 /*return*/, true];
                    case 10:
                        _d = space.defaultAuthority;
                        switch (_d) {
                            case Space_1.SpaceAuth.NONE: return [3 /*break*/, 11];
                            case Space_1.SpaceAuth.VISIBLE: return [3 /*break*/, 11];
                            case Space_1.SpaceAuth.READABLE: return [3 /*break*/, 11];
                            case Space_1.SpaceAuth.WRITABLE: return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 11: return [4 /*yield*/, belongSpace()];
                    case 12: return [2 /*return*/, _e.sent()];
                    case 13: return [2 /*return*/, true];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    AuthorityQuery.prototype.getSpaceAuth = function (auth, userId, spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var where, space, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = util_1.isNumber(spaceId) ? { id: spaceId } : { entityId: spaceId };
                        return [4 /*yield*/, this.spaces.where(where).getOne()];
                    case 1:
                        space = _a.sent();
                        if (!space) {
                            throw new Errors_1.NotFoundEntity();
                        }
                        return [4 /*yield*/, this.getSpaceAuthByEntity(auth, userId, space)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, [result, space]];
                }
            });
        });
    };
    AuthorityQuery.prototype.getContentAuth = function (auth, userId, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var where, content, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = util_1.isNumber(contentId) ? { id: contentId } : { entityId: contentId };
                        return [4 /*yield*/, this.contents
                                .where(where)
                                .leftJoinAndSelect("container", "container")
                                .leftJoinAndSelect("container.space", "space")
                                .leftJoinAndSelect("space", "space")
                                .getOne()];
                    case 1:
                        content = _a.sent();
                        if (!content) {
                            throw new Errors_1.NotFoundEntity();
                        }
                        return [4 /*yield*/, this.getSpaceAuthByEntity(auth, userId, content.container.space)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, [result, content]];
                }
            });
        });
    };
    AuthorityQuery.prototype.getMaterialAuth = function (auth, userId, materialId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var where, material, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        where = util_1.isNumber(materialId) ? { id: materialId } : { entityId: materialId };
                        return [4 /*yield*/, this.materials
                                .where(where)
                                .leftJoinAndSelect("content", "content")
                                .leftJoinAndSelect("content.container", "container")
                                .leftJoinAndSelect("container.space", "space")
                                .leftJoinAndSelect("space", "space")
                                .getOne()];
                    case 1:
                        material = _c.sent();
                        if (!material) {
                            throw new Errors_1.NotFoundEntity();
                        }
                        result = false;
                        if (!((_a = material.content) === null || _a === void 0 ? void 0 : _a.container.space)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getSpaceAuthByEntity(auth, userId, (_b = material.content) === null || _b === void 0 ? void 0 : _b.container.space)];
                    case 2:
                        result = _c.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!material.space) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getSpaceAuthByEntity(auth, userId, material.space)];
                    case 4:
                        result = _c.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new Errors_1.InternalError();
                    case 6: return [2 /*return*/, [result, material]];
                }
            });
        });
    };
    return AuthorityQuery;
}());
exports.AuthorityQuery = AuthorityQuery;
//# sourceMappingURL=AuthorityQuery.js.map