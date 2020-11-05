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
exports.ServiceContainer = void 0;
var client_sql_1 = require("./client_sql");
var utils_base_1 = require("./utils_base");
var utils_authority_1 = require("./utils_authority");
var utils_entities_1 = require("./utils_entities");
var utils_format_1 = require("./utils_format");
var base = utils_base_1.UtilsBase;
var auth = utils_authority_1.UtilsSpaceAuthorization;
var formatUtils = utils_format_1.UtilsFormat;
var ServiceContainer = /** @class */ (function () {
    function ServiceContainer() {
    }
    ServiceContainer._getFocusedFormatFromStructureId = function (structureId) {
        return __awaiter(this, void 0, void 0, function () {
            var format;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, formatUtils.joinProperties(client_sql_1.Structure
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
                        return [2 /*return*/, utils_entities_1.toFocusedFormatFromStructure(format)];
                }
            });
        });
    };
    ServiceContainer.getContainers = function (displayId) {
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
                        return [4 /*yield*/, base.getMyUser()];
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
                    case 5: return [4 /*yield*/, auth.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.READABLE)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, containers];
                }
            });
        });
    };
    ServiceContainer.getContent = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var content, user, format;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_sql_1.Content
                            .createQueryBuilder("content")
                            .leftJoinAndSelect("content.container", "container")
                            .leftJoinAndSelect("container.space", "space")
                            .leftJoinAndSelect("content.updaterUser", "updaterUser")
                            .leftJoinAndSelect("content.creatorUser", "creatorUser")
                            .where("content.entityId = :entityId")
                            .setParameters({ entityId: args.contentId })
                            .getOne()];
                    case 1:
                        content = _a.sent();
                        return [4 /*yield*/, base.getMyUser()];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, auth.checkSpaceAuth(user, content.container.space, client_sql_1.SpaceAuth.READABLE)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this._getFocusedFormatFromStructureId(content.structureId)];
                    case 4:
                        format = _a.sent();
                        return [2 /*return*/, utils_entities_1.toFocusedContent(content, format, null)];
                }
            });
        });
    };
    ServiceContainer.createContent = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, space, structure, container, content, mongoContainer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, client_sql_1.Space.findOne({ entityId: args.spaceId })];
                    case 2:
                        space = _a.sent();
                        return [4 /*yield*/, auth.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.WRITABLE)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, client_sql_1.Structure.findOne({ entityId: args.structureId })];
                    case 4:
                        structure = _a.sent();
                        return [4 /*yield*/, base.conn.getRepository(client_sql_1.Container)
                                .createQueryBuilder("container")
                                .where("container.spaceId = :spaceId")
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
                        mongoContainer = base.mongo.getContainer(container.entityId);
                        mongoContainer.insertOne(args.data);
                        return [2 /*return*/, content];
                }
            });
        });
    };
    return ServiceContainer;
}());
exports.ServiceContainer = ServiceContainer;
//# sourceMappingURL=service_container.js.map