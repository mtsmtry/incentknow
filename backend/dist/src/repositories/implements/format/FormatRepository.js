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
exports.FormatCommand = exports.FormatRepository = void 0;
var FormatQuery_1 = require("../../queries/format/FormatQuery");
var StructureQuery_1 = require("../../queries/format/StructureQuery");
var FormatRepository = /** @class */ (function () {
    function FormatRepository(formats, structures, props) {
        this.formats = formats;
        this.structures = structures;
        this.props = props;
    }
    FormatRepository.prototype.fromFormats = function (trx) {
        return new FormatQuery_1.FormatQuery(this.formats.createQuery(trx));
    };
    FormatRepository.prototype.fromStructures = function (trx) {
        return new StructureQuery_1.StructureQuery(this.structures.createQuery(trx));
    };
    FormatRepository.prototype.createCommand = function (trx) {
        return new FormatCommand(this.formats.createCommand(trx), this.structures.createCommand(trx), this.props.createCommand(trx));
    };
    return FormatRepository;
}());
exports.FormatRepository = FormatRepository;
var FormatCommand = /** @class */ (function () {
    function FormatCommand(formats, structures, props) {
        this.formats = formats;
        this.structures = structures;
        this.props = props;
    }
    FormatCommand.prototype._createProperty = function (formatId, parentPropertyId, order, info) {
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
                                if (tyArgs.subType) {
                                    prop.argType = tyArgs.subType.name;
                                }
                                if (!tyArgs.format) return [3 /*break*/, 2];
                                _a = prop;
                                return [4 /*yield*/, this.formats.findOne({ entityId: tyArgs.format })];
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
                        prop = this.props.create({
                            formatId: formatId,
                            parentPropertyId: parentPropertyId,
                            displayName: info.displayName,
                            typeName: info.type.name,
                            order: order,
                            fieldName: info.fieldName,
                            semantic: info.semantic,
                            optional: info.optional
                        });
                        // set arguments
                        return [4 /*yield*/, setTypeArguments(prop, info.type)];
                    case 1:
                        // set arguments
                        _a.sent();
                        if (!info.type.subType) return [3 /*break*/, 3];
                        return [4 /*yield*/, setTypeArguments(prop, info.type.subType)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.props.save(prop)];
                    case 4:
                        // save
                        prop = _a.sent();
                        // set properties
                        return [4 /*yield*/, setSubProperties(prop, info.type)];
                    case 5:
                        // set properties
                        _a.sent();
                        if (!info.type.subType) return [3 /*break*/, 7];
                        return [4 /*yield*/, setSubProperties(prop, info.type.subType)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, prop];
                }
            });
        });
    };
    FormatCommand.prototype.createFormat = function (userId, spaceId, displayName, description, usage, properties) {
        return __awaiter(this, void 0, void 0, function () {
            var format, structure, props;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        format = this.formats.create({
                            creatorUserId: userId,
                            updaterUserId: userId,
                            spaceId: spaceId,
                            displayName: displayName,
                            description: description,
                            usage: usage
                        });
                        return [4 /*yield*/, this.formats.save(format)];
                    case 1:
                        format = _a.sent();
                        structure = this.structures.create({
                            formatId: format.id
                        });
                        return [4 /*yield*/, this.structures.save(structure)];
                    case 2:
                        structure = _a.sent();
                        return [4 /*yield*/, Promise.all(properties.map(function (x, i) { return _this._createProperty(format.id, null, i, x); }))];
                    case 3:
                        props = _a.sent();
                        return [4 /*yield*/, this.props.save(props)];
                    case 4:
                        props = _a.sent();
                        // Format
                        this.formats.update(format.id, { currentStructureId: structure.id });
                        return [2 /*return*/, new FormatQuery_1.FormatQueryFromEntity(format)];
                }
            });
        });
    };
    return FormatCommand;
}());
exports.FormatCommand = FormatCommand;
//# sourceMappingURL=FormatRepository.js.map