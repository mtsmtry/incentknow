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
exports.SpaceService = void 0;
var Space_1 = require("../../entities/space/Space");
var SpaceMember_1 = require("../../entities/space/SpaceMember");
var BaseService_1 = require("../BaseService");
var Errors_1 = require("../Errors");
var SpaceService = /** @class */ (function (_super) {
    __extends(SpaceService, _super);
    function SpaceService(ctx, spaces, users, auth) {
        var _this = _super.call(this, ctx) || this;
        _this.spaces = spaces;
        _this.users = users;
        _this.auth = auth;
        return _this;
    }
    SpaceService.prototype.createSpace = function (displayId, displayName, description) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var space;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.spaces.createCommand(trx).createSpace(userId, displayId, displayName, description)];
                                    case 1:
                                        space = _a.sent();
                                        return [4 /*yield*/, this.spaces.createCommand(trx).addMember(space.raw.id, userId, SpaceMember_1.MemberType.OWNER)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, space.raw.entityId];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpaceService.prototype.getSpace = function (spaceDisplayId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, space, spaceRaw, auth;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectFocused().getNeededOneWithRaw()];
                    case 1:
                        _a = _b.sent(), space = _a[0], spaceRaw = _a[1];
                        return [4 /*yield*/, this.auth.fromAuths().getSpaceAuthByEntity(Space_1.SpaceAuth.VISIBLE, userId, spaceRaw)];
                    case 2:
                        auth = _b.sent();
                        if (!auth) {
                            throw new Errors_1.LackOfAuthority();
                        }
                        return [2 /*return*/, space];
                }
            });
        });
    };
    SpaceService.prototype.getRelatedSpace = function (spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, space, spaceRaw, auth;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.spaces.fromSpaces().byEntityId(spaceId).selectRelated().getNeededOneWithRaw()];
                    case 1:
                        _a = _b.sent(), space = _a[0], spaceRaw = _a[1];
                        return [4 /*yield*/, this.auth.fromAuths().getSpaceAuthByEntity(Space_1.SpaceAuth.VISIBLE, userId, spaceRaw)];
                    case 2:
                        auth = _b.sent();
                        if (!auth) {
                            throw new Errors_1.LackOfAuthority();
                        }
                        return [2 /*return*/, space];
                }
            });
        });
    };
    SpaceService.prototype.getSpaceMembers = function (spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, auth, space;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.auth.fromAuths().getSpaceAuth(Space_1.SpaceAuth.VISIBLE, userId, spaceId)];
                    case 1:
                        _a = _b.sent(), auth = _a[0], space = _a[1];
                        if (!auth) {
                            throw new Errors_1.LackOfAuthority();
                        }
                        return [4 /*yield*/, this.spaces.fromMembers().bySpace(space.id).selectIntact().getMany()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    SpaceService.prototype.getSpaceMembershipApplications = function (spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, auth, space;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.auth.fromAuths().getSpaceAuth(Space_1.SpaceAuth.VISIBLE, userId, spaceId)];
                    case 1:
                        _a = _b.sent(), auth = _a[0], space = _a[1];
                        if (!auth) {
                            throw new Errors_1.LackOfAuthority();
                        }
                        return [4 /*yield*/, this.spaces.fromMemberhipApplications().bySpace(space.id).selectIntact().getMany()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    SpaceService.prototype.getAvailableSpaceDisplayId = function (spaceDisplayId) {
        return __awaiter(this, void 0, void 0, function () {
            var spaces;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectId().getMany()];
                    case 1:
                        spaces = _a.sent();
                        return [2 /*return*/, spaces.length == 0];
                }
            });
        });
    };
    SpaceService.prototype.getFollowingSpaces = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = this.ctx.getAuthorized();
                        return [4 /*yield*/, this.spaces.fromSpaces().byFollower(userId).selectRelated().getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpaceService.prototype.getPublishedSpaces = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spaces.fromSpaces().byPublished().selectRelated().getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpaceService.prototype.acceptSpaceMembership = function (spaceId, targetUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, auth, space, app;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.auth.fromAuths(trx).getSpaceAuth(Space_1.SpaceAuth.WRITABLE, userId, spaceId)];
                                    case 1:
                                        _a = _b.sent(), auth = _a[0], space = _a[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(userId).getNeededOne()];
                                    case 2:
                                        app = _b.sent();
                                        return [4 /*yield*/, this.spaces.createCommand(trx).deleteMembershipApplication(app.id)];
                                    case 3:
                                        _b.sent();
                                        return [4 /*yield*/, this.spaces.createCommand(trx).addMember(space.id, userId, SpaceMember_1.MemberType.NORMAL)];
                                    case 4:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpaceService.prototype.rejectSpaceMembership = function (spaceId, targetUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, auth, space, user, app;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.auth.fromAuths(trx).getSpaceAuth(Space_1.SpaceAuth.WRITABLE, userId, spaceId)];
                                    case 1:
                                        _a = _b.sent(), auth = _a[0], space = _a[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, this.users.fromUsers(trx).byEntityId(targetUserId).getNeededOne()];
                                    case 2:
                                        user = _b.sent();
                                        return [4 /*yield*/, this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(user.id).getNeededOne()];
                                    case 3:
                                        app = _b.sent();
                                        return [4 /*yield*/, this.spaces.createCommand(trx).deleteMembershipApplication(app.id)];
                                    case 4:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpaceService.prototype.cancelSpaceMembershipApplication = function (spaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, auth, space, app;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.auth.fromAuths(trx).getSpaceAuth(Space_1.SpaceAuth.WRITABLE, userId, spaceId)];
                                    case 1:
                                        _a = _b.sent(), auth = _a[0], space = _a[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(userId).getNeededOne()];
                                    case 2:
                                        app = _b.sent();
                                        return [4 /*yield*/, this.spaces.createCommand(trx).deleteMembershipApplication(app.id)];
                                    case 3:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpaceService.prototype.setSpaceMembershipMethod = function (spaceId, membershipMethod) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ctx.transactionAuthorized(function (trx, userId) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, auth, space;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.auth.fromAuths(trx).getSpaceAuth(Space_1.SpaceAuth.WRITABLE, userId, spaceId)];
                                    case 1:
                                        _a = _b.sent(), auth = _a[0], space = _a[1];
                                        if (!auth) {
                                            throw new Errors_1.LackOfAuthority();
                                        }
                                        return [4 /*yield*/, this.spaces.createCommand(trx).setSpaceMembershipMethod(space.id, membershipMethod)];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SpaceService;
}(BaseService_1.BaseService));
exports.SpaceService = SpaceService;
//# sourceMappingURL=SpaceService.js.map