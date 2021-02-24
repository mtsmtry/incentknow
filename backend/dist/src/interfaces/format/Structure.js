"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedStructure = exports.toPropertyInfo = exports.Type = void 0;
var Property_1 = require("../../entities/format/Property");
var Implication_1 = require("../../Implication");
var Utils_1 = require("../Utils");
var Type = /** @class */ (function () {
    function Type(src) {
        Object.assign(this, src);
    }
    __decorate([
        Implication_1.DataKind(),
        __metadata("design:type", String)
    ], Type.prototype, "name", void 0);
    __decorate([
        Implication_1.DataMember([Property_1.TypeName.CONTENT, Property_1.TypeName.ENTITY]),
        __metadata("design:type", String)
    ], Type.prototype, "format", void 0);
    __decorate([
        Implication_1.DataMember([Property_1.TypeName.ARRAY]),
        __metadata("design:type", Type)
    ], Type.prototype, "subType", void 0);
    __decorate([
        Implication_1.DataMember([Property_1.TypeName.CODE]),
        __metadata("design:type", String)
    ], Type.prototype, "language", void 0);
    __decorate([
        Implication_1.DataMember([Property_1.TypeName.OBJECT]),
        __metadata("design:type", Array)
    ], Type.prototype, "properties", void 0);
    __decorate([
        Implication_1.DataMember([Property_1.TypeName.ENUM]),
        __metadata("design:type", Array)
    ], Type.prototype, "enumerators", void 0);
    Type = __decorate([
        Implication_1.Data(),
        __metadata("design:paramtypes", [Object])
    ], Type);
    return Type;
}());
exports.Type = Type;
function toPropertyInfo(prop) {
    var _a, _b;
    var res = {
        id: prop.entityId,
        displayName: prop.displayName,
        fieldName: prop.fieldName,
        optional: prop.optional,
        semantic: prop.semantic,
        type: new Type({
            name: prop.typeName
        })
    };
    if (prop.typeName == Property_1.TypeName.ARRAY) {
        Object.assign(res.type, {
            name: prop.argType,
            format: (_a = prop.argFormat) === null || _a === void 0 ? void 0 : _a.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo)
        });
    }
    else {
        Object.assign(res.type, {
            format: (_b = prop.argFormat) === null || _b === void 0 ? void 0 : _b.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo),
        });
    }
    return res;
}
exports.toPropertyInfo = toPropertyInfo;
function toFocusedStructure(structure) {
    return {
        structureId: structure.entityId,
        properties: structure.properties.map(toPropertyInfo),
        createdAt: Utils_1.toTimestamp(structure.createdAt)
    };
}
exports.toFocusedStructure = toFocusedStructure;
//# sourceMappingURL=Structure.js.map