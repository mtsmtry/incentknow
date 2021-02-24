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
exports.Material = exports.MaterialType = void 0;
var typeorm_1 = require("typeorm");
var Content_1 = require("../content/Content");
var Space_1 = require("../space/Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var MaterialCommit_1 = require("./MaterialCommit");
var MaterialType;
(function (MaterialType) {
    MaterialType["FOLDER"] = "folder";
    MaterialType["DOCUMENT"] = "document";
})(MaterialType = exports.MaterialType || (exports.MaterialType = {}));
var Material = /** @class */ (function () {
    function Material() {
    }
    Material.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Material.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Material.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content_1.Content; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "contentId" }),
        __metadata("design:type", Object)
    ], Material.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], Material.prototype, "contentId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "spaceId" }),
        __metadata("design:type", Object)
    ], Material.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], Material.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(contentId, spaceId)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], Material.prototype, "not_null_constrain", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 140, asExpression: "left(data, 140)", generatedType: "STORED" }),
        __metadata("design:type", String)
    ], Material.prototype, "beginning", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MaterialType
        }),
        __metadata("design:type", String)
    ], Material.prototype, "materialType", void 0);
    __decorate([
        typeorm_1.Column({ select: false }),
        __metadata("design:type", String)
    ], Material.prototype, "data", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Material.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "creatorUserId" }),
        __metadata("design:type", User_1.User)
    ], Material.prototype, "creatorUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Material.prototype, "creatorUserId", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], Material.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "updaterUserId" }),
        __metadata("design:type", User_1.User)
    ], Material.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Material.prototype, "updaterUserId", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return MaterialCommit_1.MaterialCommit; }, function (strc) { return strc.material; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], Material.prototype, "commits", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Material.prototype, "onInsert", null);
    Material = __decorate([
        typeorm_1.Entity()
    ], Material);
    return Material;
}());
exports.Material = Material;
//# sourceMappingURL=Material.js.map