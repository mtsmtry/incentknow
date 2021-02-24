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
exports.Property = exports.Language = exports.TypeName = void 0;
var typeorm_1 = require("typeorm");
var Utils_1 = require("../Utils");
var Format_1 = require("./Format");
var TypeName;
(function (TypeName) {
    TypeName["INT"] = "integer";
    TypeName["BOOL"] = "boolean";
    TypeName["STRING"] = "string";
    TypeName["FORMAT"] = "format";
    TypeName["SPACE"] = "space";
    TypeName["CONTENT"] = "content";
    TypeName["URL"] = "url";
    TypeName["OBJECT"] = "object";
    TypeName["TEXT"] = "text";
    TypeName["ARRAY"] = "array";
    TypeName["CODE"] = "code";
    TypeName["ENUM"] = "enumerator";
    TypeName["DOCUMENT"] = "document";
    TypeName["IMAGE"] = "image";
    TypeName["ENTITY"] = "entity";
})(TypeName = exports.TypeName || (exports.TypeName = {}));
var Language;
(function (Language) {
    Language["PYTHON"] = "python";
    Language["JAVASCRIPT"] = "javascript";
})(Language = exports.Language || (exports.Language = {}));
// 所有者: Format
var Property = /** @class */ (function () {
    function Property() {
    }
    Property_1 = Property;
    Property.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    var Property_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Property.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column("char", { length: 2 }),
        __metadata("design:type", String)
    ], Property.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format_1.Format; }, function (format) { return format.properties; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "formatId" }),
        __metadata("design:type", Format_1.Format)
    ], Property.prototype, "format", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Property.prototype, "formatId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Property_1; }, function (prop) { return prop.argProperties; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "parentPropertyId" }),
        __metadata("design:type", Object)
    ], Property.prototype, "parentProperty", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], Property.prototype, "parentPropertyId", void 0);
    __decorate([
        Utils_1.DisplayName(),
        __metadata("design:type", String)
    ], Property.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 100, nullable: true }),
        __metadata("design:type", Object)
    ], Property.prototype, "fieldName", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 100, nullable: true }),
        __metadata("design:type", Object)
    ], Property.prototype, "semantic", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], Property.prototype, "optional", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Property.prototype, "order", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: TypeName
        }),
        __metadata("design:type", String)
    ], Property.prototype, "typeName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format_1.Format; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Object)
    ], Property.prototype, "argFormat", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: TypeName,
            nullable: true
        }),
        __metadata("design:type", Object)
    ], Property.prototype, "argType", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: Language,
            nullable: true
        }),
        __metadata("design:type", Object)
    ], Property.prototype, "argLanguage", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Property_1; }, function (prop) { return prop.parentProperty; }),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], Property.prototype, "argProperties", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Property.prototype, "createdAt", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], Property.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Property.prototype, "onInsert", null);
    Property = Property_1 = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["format", "parentProperty", "order"]),
        typeorm_1.Unique(["format", "entityId"])
    ], Property);
    return Property;
}());
exports.Property = Property;
//# sourceMappingURL=Property.js.map