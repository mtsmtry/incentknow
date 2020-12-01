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
exports.ServiceFormat = void 0;
var client_sql_1 = require("./client_sql");
var utils_base_1 = require("./utils_base");
var utils_authority_1 = require("./utils_authority");
var utils_entities_1 = require("./utils_entities");
var utils_format_1 = require("./utils_format");
var base = utils_base_1.UtilsBase;
var auth = utils_authority_1.UtilsSpaceAuthorization;
var formatUtils = utils_format_1.UtilsFormat;
var ServiceFormat = /** @class */ (function () {
    function ServiceFormat() {
    }
    ServiceFormat._createProperty = function (formatId, parentPropertyId, order, info) {
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
    ServiceFormat.createFormat = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, space, format, props, structure;
            var _this = this;
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
                        format = client_sql_1.Format.new(user.id, space.id, args.displayName, args.description, args.usage);
                        return [4 /*yield*/, format.save()];
                    case 4:
                        format = _a.sent();
                        return [4 /*yield*/, Promise.all(args.properties.map(function (x, i) { return _this._createProperty(format.id, null, i, x); }))];
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
    ServiceFormat.getFormat = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var format, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, formatUtils.joinProperties(client_sql_1.Format
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
                        return [4 /*yield*/, base.getMyUser()];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, auth.checkSpaceAuth(user, format.space, client_sql_1.SpaceAuth.READABLE)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, utils_entities_1.toFocusedFormat(format)];
                }
            });
        });
    };
    return ServiceFormat;
}());
exports.ServiceFormat = ServiceFormat;
//# sourceMappingURL=service_format.js.map