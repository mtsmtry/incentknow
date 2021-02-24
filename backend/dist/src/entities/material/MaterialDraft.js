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
exports.MaterialDraft = exports.MaterialChangeType = void 0;
var typeorm_1 = require("typeorm");
var Content_1 = require("../content/Content");
var Space_1 = require("../space/Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var MaterialEditing_1 = require("./MaterialEditing");
var MaterialChangeType;
(function (MaterialChangeType) {
    MaterialChangeType["INITIAL"] = "initial";
    MaterialChangeType["WRITE"] = "write";
    MaterialChangeType["REMOVE"] = "remove";
})(MaterialChangeType = exports.MaterialChangeType || (exports.MaterialChangeType = {}));
var MaterialDraft = /** @class */ (function () {
    function MaterialDraft() {
    }
    MaterialDraft.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return MaterialEditing_1.MaterialEditing; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "currentEditingId" }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "currentEditing", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "currentEditingId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content_1.Content; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "materialId" }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "material", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "materialId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "intendedContentDraftId" }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "intendedContentDraft", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "intendedContentDraftId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "intendedSpaceId" }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "intendedSpace", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "intendedSpaceId", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(materialId, intendedContentDraftId, intendedSpaceId)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "not_null_constrain", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(materialId, -createdAt)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "unique_by_user_constrain", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], MaterialDraft.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "userId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], MaterialDraft.prototype, "createdAt", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], MaterialDraft.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MaterialChangeType,
            default: MaterialChangeType.INITIAL
        }),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "changeType", void 0);
    __decorate([
        typeorm_1.Column("varchar", { select: false, nullable: true }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "data", void 0);
    __decorate([
        typeorm_1.Column({ type: "varchar", length: 140, nullable: true, asExpression: "left(data, 140)", generatedType: "STORED" }),
        __metadata("design:type", Object)
    ], MaterialDraft.prototype, "beginning", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MaterialDraft.prototype, "onInsert", null);
    MaterialDraft = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["unique_by_user_constrain", "user"])
    ], MaterialDraft);
    return MaterialDraft;
}());
exports.MaterialDraft = MaterialDraft;
//# sourceMappingURL=MaterialDraft.js.map