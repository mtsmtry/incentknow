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
exports.FormatService = exports.SpaceService = exports.UserService = exports.DbClient = void 0;
var sql_1 = require("./sql");
var DbClient = /** @class */ (function () {
    function DbClient(conn) {
        this.conn = conn;
    }
    DbClient.prototype.getContent = function (contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conn.getRepository(sql_1.Content)
                            .createQueryBuilder("content")
                            .leftJoinAndSelect("content.format", "format", null, ["immutableDisplayId", "displayName", "description", "usage"])
                            .leftJoinAndSelect("content.structure", "format.structure")
                            .leftJoinAndSelect("content.creator", "creator", null, ["displayId", "displayName", "iconUrl"])
                            .leftJoinAndSelect("content.updator", "updator", null, ["displayId", "displayName", "iconUrl"])
                            .where("id = :contentId")
                            .setParameters({ contentId: contentId })
                            .getOne()];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, content];
                }
            });
        });
    };
    DbClient.prototype.getFormat = function (formatDisplayId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DbClient;
}());
exports.DbClient = DbClient;
var UserService = /** @class */ (function () {
    function UserService(conn) {
        this.conn = conn;
    }
    UserService.prototype.createUser = function (email, displayName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = sql_1.User.new(email, displayName, password);
                        return [4 /*yield*/, user.save()];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
var SpaceService = /** @class */ (function () {
    function SpaceService(conn) {
        this.conn = conn;
    }
    SpaceService.prototype.createSpace = function (userId, displayName, description) {
        return __awaiter(this, void 0, void 0, function () {
            var space, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        space = sql_1.Space.new(userId, displayName, description);
                        return [4 /*yield*/, space.save()];
                    case 1:
                        space = _a.sent();
                        member = sql_1.SpaceMember.new(space.id, userId, sql_1.MemberType.OWNER);
                        return [4 /*yield*/, member.save()];
                    case 2:
                        member = _a.sent();
                        return [2 /*return*/, space];
                }
            });
        });
    };
    SpaceService.prototype.getSpace = function (displayId) {
        return __awaiter(this, void 0, void 0, function () {
            var space;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conn.getRepository(sql_1.Space)
                            .createQueryBuilder("space")
                            .leftJoinAndSelect("space.creatorUser", "creatorUser")
                            .where("space.displayId = :displayId")
                            .setParameters({ displayId: displayId })
                            .getOne()];
                    case 1:
                        space = _a.sent();
                        return [2 /*return*/, space];
                }
            });
        });
    };
    SpaceService.prototype.getMembers = function (displayId) {
        return __awaiter(this, void 0, void 0, function () {
            var members;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conn.getRepository(sql_1.SpaceMember)
                            .createQueryBuilder("member")
                            .leftJoin("member.space", "space")
                            .leftJoinAndSelect("member.user", "user")
                            .where("space.displayId = :displayId")
                            .setParameters({ displayId: displayId })
                            .getMany()];
                    case 1:
                        members = _a.sent();
                        return [2 /*return*/, members];
                }
            });
        });
    };
    SpaceService.prototype.getContainers = function (displayId) {
        return __awaiter(this, void 0, void 0, function () {
            var containers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conn.getRepository(sql_1.Container)
                            .createQueryBuilder("container")
                            .leftJoin("container.space", "space")
                            .leftJoinAndSelect("container.format", "format")
                            .where("space.displayId = :displayId")
                            .setParameters({ displayId: displayId })
                            .getMany()];
                    case 1:
                        containers = _a.sent();
                        return [2 /*return*/, containers];
                }
            });
        });
    };
    return SpaceService;
}());
exports.SpaceService = SpaceService;
var FormatService = /** @class */ (function () {
    function FormatService(conn) {
        this.conn = conn;
    }
    FormatService.prototype.createProperty = function (formatId, parentPropertyId, order, info) {
        return __awaiter(this, void 0, void 0, function () {
            var prop, tyArgs, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prop = sql_1.Property.new(formatId, parentPropertyId, info.id, info.displayName, info.type.name, order);
                        prop.fieldName = info.fieldName;
                        prop.semantic = info.semantic;
                        prop.optional = info.optional;
                        tyArgs = info.type.arguments;
                        if (tyArgs.language) {
                            prop.argLanguage = tyArgs.language;
                        }
                        if (tyArgs.type) {
                            prop.argType = tyArgs.type.name;
                        }
                        if (!tyArgs.format) return [3 /*break*/, 2];
                        _a = prop;
                        return [4 /*yield*/, this.conn.manager.getRepository(sql_1.Format).findOne({ entityId: tyArgs.format })];
                    case 1:
                        _a.argFormat = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, prop.save()];
                    case 3:
                        prop = _b.sent();
                        if (!tyArgs.properties) return [3 /*break*/, 5];
                        return [4 /*yield*/, Promise.all(tyArgs.properties.map(function (x, i) { return _this.createProperty(formatId, prop.id, i, x); }))];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, prop];
                }
            });
        });
    };
    FormatService.prototype.createFormat = function (creatorUserId, spaceId, displayName, description, usage, properties) {
        return __awaiter(this, void 0, void 0, function () {
            var format, props, structure;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        format = sql_1.Format.new(creatorUserId, spaceId, displayName, description, usage);
                        return [4 /*yield*/, format.save()];
                    case 1:
                        format = _a.sent();
                        return [4 /*yield*/, Promise.all(properties.map(function (x, i) { return _this.createProperty(format.id, null, i, x); }))];
                    case 2:
                        props = _a.sent();
                        return [4 /*yield*/, this.conn.getRepository(sql_1.Property).save(props)];
                    case 3:
                        props = _a.sent();
                        structure = sql_1.Structure.new(format.id, props);
                        return [4 /*yield*/, structure.save()];
                    case 4:
                        structure = _a.sent();
                        return [4 /*yield*/, this.conn.getRepository(sql_1.Format).update({ id: format.id }, { currentStructure: sql_1.Structure.create({ id: structure.id }) })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, format];
                }
            });
        });
    };
    FormatService.prototype.getFormat = function (displayId) {
        return __awaiter(this, void 0, void 0, function () {
            var start, format;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = Date.now();
                        return [4 /*yield*/, this.conn.getRepository(sql_1.Format)
                                .createQueryBuilder("format")
                                .leftJoinAndSelect("format.space", "space")
                                .leftJoinAndSelect("format.creatorUser", "creatorUser")
                                .leftJoinAndSelect("format.currentStructure", "currentStructure")
                                .leftJoinAndSelect("currentStructure.properties", "properties")
                                .leftJoinAndSelect("properties.argProperties", "argProperties")
                                .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
                                .leftJoinAndSelect("argProperties2.argProperties", "argProperties3")
                                .where("format.displayId = :displayId")
                                .setParameters({ displayId: displayId })
                                .getOne()];
                    case 1:
                        format = _a.sent();
                        console.log(Date.now() - start);
                        return [2 /*return*/, format];
                }
            });
        });
    };
    FormatService.prototype.deleteFormat = function (formatId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.conn.getRepository(sql_1.Format).delete({ id: formatId })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FormatService;
}());
exports.FormatService = FormatService;
//# sourceMappingURL=client.js.map