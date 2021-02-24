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
exports.Format = exports.FormatUsage = void 0;
var typeorm_1 = require("typeorm");
var Space_1 = require("../space/Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var Property_1 = require("./Property");
var Structure_1 = require("./Structure");
var FormatUsage;
(function (FormatUsage) {
    FormatUsage["INTERNAL"] = "internal";
    FormatUsage["EXTERNAL"] = "external";
})(FormatUsage = exports.FormatUsage || (exports.FormatUsage = {}));
var Format = /** @class */ (function () {
    function Format() {
    }
    Format.prototype.onInsert = function () {
        this.displayId = Utils_1.createDisplayId();
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Format.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Format.prototype, "entityId", void 0);
    __decorate([
        Utils_1.DisplayId(),
        __metadata("design:type", String)
    ], Format.prototype, "displayId", void 0);
    __decorate([
        Utils_1.DisplayName(),
        __metadata("design:type", String)
    ], Format.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "spaceId" }),
        __metadata("design:type", Space_1.Space)
    ], Format.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Format.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Format.prototype, "description", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Structure_1.Structure; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "currentStructureId" }),
        __metadata("design:type", Structure_1.Structure)
    ], Format.prototype, "currentStructure", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Format.prototype, "currentStructureId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: FormatUsage
        }),
        __metadata("design:type", String)
    ], Format.prototype, "usage", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Format.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "creatorUserId" }),
        __metadata("design:type", User_1.User)
    ], Format.prototype, "creatorUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Format.prototype, "creatorUserId", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], Format.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "updaterUserId" }),
        __metadata("design:type", User_1.User)
    ], Format.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Format.prototype, "updaterUserId", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Structure_1.Structure; }, function (strc) { return strc.format; }, { onDelete: "CASCADE" }),
        __metadata("design:type", Array)
    ], Format.prototype, "structures", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Property_1.Property; }, function (prop) { return prop.format; }, { onDelete: "CASCADE", cascade: ["insert"] }),
        __metadata("design:type", Array)
    ], Format.prototype, "properties", void 0);
    __decorate([
        typeorm_1.Column("char", { length: 2, nullable: true }),
        __metadata("design:type", Object)
    ], Format.prototype, "semanticId", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Format.prototype, "onInsert", null);
    Format = __decorate([
        typeorm_1.Entity()
    ], Format);
    return Format;
}());
exports.Format = Format;
//# sourceMappingURL=Format.js.map