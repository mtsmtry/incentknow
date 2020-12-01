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
exports.Server = exports.CacheClient = void 0;
var typeorm_1 = require("typeorm");
var client_mongodb_1 = require("./client_mongodb");
var client_sql_1 = require("./client_sql");
function toTimestamp(date) {
    var milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}
function toFocusedSpace(space) {
    return {
        entityId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        creatorUser: toRelatedUser(space.creatorUser),
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}
function toRelatedSpace(space) {
    return {
        entityId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}
function toRelatedUser(user) {
    return {
        entityId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    };
}
function toPropertyInfo(prop) {
    var _a, _b;
    var res = {
        id: prop.entityId,
        displayName: prop.displayName,
        fieldName: prop.fieldName,
        optional: prop.optional,
        semantic: prop.semantic,
        type: {
            name: prop.typeName,
            arguments: {}
        }
    };
    if (prop.typeName == client_sql_1.TypeName.ARRAY) {
        res.type.arguments = {
            type: {
                name: prop.argType,
                arguments: {
                    format: (_a = prop.argFormat) === null || _a === void 0 ? void 0 : _a.entityId,
                    language: prop.argLanguage,
                    properties: prop.argProperties.map(toPropertyInfo)
                }
            }
        };
    }
    else {
        res.type.arguments = {
            format: (_b = prop.argFormat) === null || _b === void 0 ? void 0 : _b.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo)
        };
    }
    return res;
}
function toFocusedStructure(structure) {
    return {
        entityId: structure.entityId,
        properties: structure.properties.map(toPropertyInfo),
        createdAt: toTimestamp(structure.createdAt)
    };
}
function toFocusedFormat(format) {
    return {
        entityId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: toRelatedSpace(format.space),
        generator: format.generator,
        usage: format.usage,
        createdAt: toTimestamp(format.createdAt),
        creatorUser: toRelatedUser(format.creatorUser),
        updatedAt: toTimestamp(format.updatedAt),
        updaterUser: toRelatedUser(format.updaterUser),
        structure: toFocusedStructure(format.currentStructure)
    };
}
function toFocusedFormatFromStructure(structure) {
    return {
        entityId: structure.format.entityId,
        displayId: structure.format.displayId,
        displayName: structure.format.displayName,
        description: structure.format.description,
        space: toRelatedSpace(structure.format.space),
        generator: structure.format.generator,
        usage: structure.format.usage,
        createdAt: toTimestamp(structure.format.createdAt),
        creatorUser: toRelatedUser(structure.format.creatorUser),
        updatedAt: toTimestamp(structure.format.updatedAt),
        updaterUser: toRelatedUser(structure.format.updaterUser),
        structure: toFocusedStructure(structure)
    };
}
function toFocusedContent(content, format, data) {
    return {
        entityId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        data: data
    };
}
var CacheClient = /** @class */ (function () {
    function CacheClient() {
    }
    return CacheClient;
}());
exports.CacheClient = CacheClient;
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var env, connectOption, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.mongo = new client_mongodb_1.MongoClient();
                        return [4 /*yield*/, this.mongo.init()];
                    case 1:
                        _b.sent();
                        env = process.env.ENV_SETTINGS;
                        connectOption = require("../ormconfig." + env + ".json");
                        _a = this;
                        return [4 /*yield*/, typeorm_1.createConnection(connectOption)];
                    case 2:
                        _a.conn = _b.sent();
                        return [4 /*yield*/, this.conn.synchronize()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.getMyUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.conn.getRepository(client_sql_1.User).findOne({ entityId: this.userId })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    //================================================================================
    // Test
    //================================================================================
    Server.prototype.helloworld = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "Hello world!"];
            });
        });
    };
    Server.prototype.getMe = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = toRelatedUser;
                        return [4 /*yield*/, this.getMyUser()];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    Server.prototype.mongodb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mongo.client.db("main").collection('test').findOne({ name: "ryoi" })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    //================================================================================
    // User service
    //================================================================================
    Server.prototype.createUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = client_sql_1.User.new(args.email, args.displayName, args.password);
                        return [4 /*yield*/, user.save()];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    //================================================================================
    // Space service
    //================================================================================
    Server.prototype.hasSpaceAuth = function (user, space, auth) {
        return __awaiter(this, void 0, void 0, function () {
            var belongSpace, _a, _b, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        belongSpace = function () {
                            if (!user) {
                                return false;
                            }
                            var member = _this.conn.getRepository(client_sql_1.SpaceMember).findOne({ space: space, user: user });
                            return Boolean(member);
                        };
                        _a = auth;
                        switch (_a) {
                            case client_sql_1.SpaceAuth.NONE: return [3 /*break*/, 1];
                            case client_sql_1.SpaceAuth.VISIBLE: return [3 /*break*/, 2];
                            case client_sql_1.SpaceAuth.READABLE: return [3 /*break*/, 6];
                            case client_sql_1.SpaceAuth.WRITABLE: return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 14];
                    case 1: return [2 /*return*/, true];
                    case 2:
                        _b = space.defaultAuthority;
                        switch (_b) {
                            case client_sql_1.SpaceAuth.NONE: return [3 /*break*/, 3];
                            case client_sql_1.SpaceAuth.VISIBLE: return [3 /*break*/, 5];
                            case client_sql_1.SpaceAuth.READABLE: return [3 /*break*/, 5];
                            case client_sql_1.SpaceAuth.WRITABLE: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, belongSpace()];
                    case 4: return [2 /*return*/, _e.sent()];
                    case 5: return [2 /*return*/, true];
                    case 6:
                        _c = space.defaultAuthority;
                        switch (_c) {
                            case client_sql_1.SpaceAuth.NONE: return [3 /*break*/, 7];
                            case client_sql_1.SpaceAuth.VISIBLE: return [3 /*break*/, 7];
                            case client_sql_1.SpaceAuth.READABLE: return [3 /*break*/, 9];
                            case client_sql_1.SpaceAuth.WRITABLE: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, belongSpace()];
                    case 8: return [2 /*return*/, _e.sent()];
                    case 9: return [2 /*return*/, true];
                    case 10:
                        _d = space.defaultAuthority;
                        switch (_d) {
                            case client_sql_1.SpaceAuth.NONE: return [3 /*break*/, 11];
                            case client_sql_1.SpaceAuth.VISIBLE: return [3 /*break*/, 11];
                            case client_sql_1.SpaceAuth.READABLE: return [3 /*break*/, 11];
                            case client_sql_1.SpaceAuth.WRITABLE: return [3 /*break*/, 13];
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
    Server.prototype.checkSpaceAuth = function (user, space, auth) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasSpaceAuth(user, space, auth)];
                    case 1:
                        if (!(_a.sent())) {
                            throw "lacked authority";
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.createSpace = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, space, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_sql_1.User.findOne({ entityId: this.userId })];
                    case 1:
                        user = _a.sent();
                        space = client_sql_1.Space.new(user.id, args.displayName, args.description);
                        return [4 /*yield*/, space.save()];
                    case 2:
                        space = _a.sent();
                        member = client_sql_1.SpaceMember.new(space.id, user.id, client_sql_1.MemberType.OWNER);
                        return [4 /*yield*/, member.save()];
                    case 3:
                        member = _a.sent();
                        return [2 /*return*/, space];
                }
            });
        });
    };
    Server.prototype.getSpace = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, space;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.getMyUser(),
                            // get space
                            this.conn.getRepository(client_sql_1.Space)
                                .createQueryBuilder("space")
                                .leftJoinAndSelect("space.creatorUser", "creatorUser")
                                .where("space.displayId = :displayId")
                                .setParameters({ displayId: args.spaceDisplayId })
                                .getOne()])];
                    case 1:
                        _a = _b.sent(), user = _a[0], space = _a[1];
                        return [4 /*yield*/, this.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.VISIBLE)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, toFocusedSpace(space)];
                }
            });
        });
    };
    Server.prototype.getSpaceMembers = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, members, space;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.SpaceMember
                                .createQueryBuilder("member")
                                .leftJoin("member.space", "space")
                                .leftJoinAndSelect("member.user", "user")
                                .where("space.entityId = :spaceId")
                                .setParameters({ spaceId: args.spaceId })
                                .getMany()];
                    case 2:
                        members = _a.sent();
                        return [4 /*yield*/, client_sql_1.Space.findOne({ entityId: args.spaceId })];
                    case 3:
                        space = _a.sent();
                        return [4 /*yield*/, this.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.VISIBLE)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, members];
                }
            });
        });
    };
    //================================================================================
    // Format service
    //================================================================================
    Server.prototype.joinProperties = function (query, structureName) {
        return query
            .leftJoinAndSelect(structureName + ".properties", "properties")
            .leftJoinAndSelect("properties.argFormat", "argFormat")
            .leftJoinAndSelect("properties.argProperties", "argProperties")
            .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
            .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
            .leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
            .leftJoinAndSelect("argProperties2.argProperties", "argProperties3");
    };
    Server.prototype.getFocusedFormatFromStructureId = function (structureId) {
        return __awaiter(this, void 0, void 0, function () {
            var format;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.joinProperties(client_sql_1.Structure
                            .createQueryBuilder("structure")
                            .leftJoinAndSelect("structure.format", "format")
                            .leftJoinAndSelect("format.space", "space")
                            .leftJoinAndSelect("format.creatorUser", "creatorUser")
                            .leftJoinAndSelect("format.updaterUser", "updaterUser"), "structure")
                            .where("structure.id = :structureId")
                            .setParameters({ structureId: structureId })
                            .getOne()];
                    case 1:
                        format = _a.sent();
                        return [2 /*return*/, toFocusedFormatFromStructure(format)];
                }
            });
        });
    };
    Server.prototype.createProperty = function (formatId, parentPropertyId, order, info) {
        return __awaiter(this, void 0, void 0, function () {
            function setTypeArguments(prop, tyArgs) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (tyArgs.language) {
                                    prop.argLanguage = tyArgs.language;
                                }
                                if (tyArgs.type) {
                                    prop.argType = tyArgs.type.name;
                                }
                                if (!tyArgs.format) return [3 /*break*/, 2];
                                _a = prop;
                                return [4 /*yield*/, client_sql_1.Format.findOne({ entityId: tyArgs.format })];
                            case 1:
                                _a.argFormat = _b.sent();
                                _b.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                });
            }
            function setSubProperties(prop, tyArgs) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!tyArgs.properties) return [3 /*break*/, 2];
                                return [4 /*yield*/, Promise.all(tyArgs.properties.map(function (x, i) { return _this.createProperty(formatId, prop.id, i, x); }))];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                });
            }
            var prop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prop = client_sql_1.Property.new(formatId, parentPropertyId, info.id, info.displayName, info.type.name, order);
                        prop.fieldName = info.fieldName;
                        prop.semantic = info.semantic;
                        prop.optional = info.optional;
                        // set arguments
                        return [4 /*yield*/, setTypeArguments(prop, info.type.arguments)];
                    case 1:
                        // set arguments
                        _a.sent();
                        if (!info.type.arguments.type) return [3 /*break*/, 3];
                        return [4 /*yield*/, setTypeArguments(prop, info.type.arguments.type.arguments)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, prop.save()];
                    case 4:
                        // save
                        prop = _a.sent();
                        // set properties
                        return [4 /*yield*/, setSubProperties(prop, info.type.arguments)];
                    case 5:
                        // set properties
                        _a.sent();
                        if (!info.type.arguments.type) return [3 /*break*/, 7];
                        return [4 /*yield*/, setSubProperties(prop, info.type.arguments.type.arguments)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, prop];
                }
            });
        });
    };
    Server.prototype.createFormat = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, space, format, props, structure;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.Space.findOne({ entityId: args.spaceId })];
                    case 2:
                        space = _a.sent();
                        return [4 /*yield*/, this.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.WRITABLE)];
                    case 3:
                        _a.sent();
                        format = client_sql_1.Format.new(user.id, space.id, args.displayName, args.description, args.usage);
                        return [4 /*yield*/, format.save()];
                    case 4:
                        format = _a.sent();
                        return [4 /*yield*/, Promise.all(args.properties.map(function (x, i) { return _this.createProperty(format.id, null, i, x); }))];
                    case 5:
                        props = _a.sent();
                        return [4 /*yield*/, client_sql_1.Property.save(props)];
                    case 6:
                        props = _a.sent();
                        structure = client_sql_1.Structure.new(format.id, props);
                        return [4 /*yield*/, structure.save()];
                    case 7:
                        structure = _a.sent();
                        // set format.currentStructure
                        return [4 /*yield*/, client_sql_1.Format.update(format.id, { currentStructure: client_sql_1.Structure.create({ id: structure.id }) })];
                    case 8:
                        // set format.currentStructure
                        _a.sent();
                        return [2 /*return*/, format];
                }
            });
        });
    };
    Server.prototype.getFormat = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var format, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.joinProperties(client_sql_1.Format
                            .createQueryBuilder("format")
                            .leftJoinAndSelect("format.space", "space")
                            .leftJoinAndSelect("format.creatorUser", "creatorUser")
                            .leftJoinAndSelect("format.updaterUser", "updaterUser")
                            .leftJoinAndSelect("format.currentStructure", "currentStructure"), "currentStructure")
                            .where("format.displayId = :displayId")
                            .setParameters({ displayId: args.formatDisplayId })
                            .getOne()];
                    case 1:
                        format = _a.sent();
                        return [4 /*yield*/, this.getMyUser()];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.checkSpaceAuth(user, format.space, client_sql_1.SpaceAuth.READABLE)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, toFocusedFormat(format)];
                }
            });
        });
    };
    //================================================================================
    // Container service
    //================================================================================
    Server.prototype.getContainers = function (displayId) {
        return __awaiter(this, void 0, void 0, function () {
            var containers, user, space;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_sql_1.Container
                            .createQueryBuilder("container")
                            .leftJoin("container.space", "space")
                            .leftJoinAndSelect("container.format", "format")
                            .where("space.displayId = :displayId")
                            .setParameters({ displayId: displayId })
                            .getMany()];
                    case 1:
                        containers = _a.sent();
                        return [4 /*yield*/, this.getMyUser()];
                    case 2:
                        user = _a.sent();
                        space = null;
                        if (!(containers.length == 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, client_sql_1.Space.findOne({ displayId: displayId })];
                    case 3:
                        space = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        space = containers[0].space;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.READABLE)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, containers];
                }
            });
        });
    };
    Server.prototype.getContent = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var content, user, format;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_sql_1.Content
                            .createQueryBuilder("content")
                            .leftJoinAndSelect("content.space", "space")
                            .leftJoinAndSelect("content.container", "container")
                            .leftJoinAndSelect("container.space", "space")
                            .leftJoinAndSelect("content.updaterUser", "updaterUser")
                            .leftJoinAndSelect("content.creatorUser", "creatorUser")
                            .where("content.entityId = :entityId")
                            .setParameters({ entityId: args.contentId })
                            .getOne()];
                    case 1:
                        content = _a.sent();
                        return [4 /*yield*/, this.getMyUser()];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.checkSpaceAuth(user, content.container.space, client_sql_1.SpaceAuth.READABLE)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getFocusedFormatFromStructureId(content.structureId)];
                    case 4:
                        format = _a.sent();
                        return [2 /*return*/, toFocusedContent(content, format, null)];
                }
            });
        });
    };
    Server.prototype.createContent = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, space, structure, container, content, mongoContainer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.Space.findOne({ entityId: args.spaceId })];
                    case 2:
                        space = _a.sent();
                        return [4 /*yield*/, this.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.WRITABLE)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, client_sql_1.Structure.findOne({ entityId: args.structureId })];
                    case 4:
                        structure = _a.sent();
                        return [4 /*yield*/, this.conn.getRepository(client_sql_1.Container)
                                .createQueryBuilder("contsainer")
                                .where("contsainer.spaceId = :spaceId")
                                .where("container.formatId = :formatId")
                                .setParameters({ spaceId: args.spaceId, formatId: structure.formatId })
                                .getOne()];
                    case 5:
                        container = _a.sent();
                        if (!!container) return [3 /*break*/, 7];
                        // create container
                        container = client_sql_1.Container.new(space.id, structure.formatId);
                        return [4 /*yield*/, container.save()];
                    case 6:
                        container = _a.sent();
                        _a.label = 7;
                    case 7:
                        content = client_sql_1.Content.new(container.id, structure.id, user.id);
                        return [4 /*yield*/, content.save()];
                    case 8:
                        content = _a.sent();
                        mongoContainer = this.mongo.getContainer(container.entityId);
                        mongoContainer.insertOne(args.data);
                        return [2 /*return*/, content];
                }
            });
        });
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map