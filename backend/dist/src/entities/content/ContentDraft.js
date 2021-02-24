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
exports.ContentDraft = exports.ContentChangeType = void 0;
var typeorm_1 = require("typeorm");
var Structure_1 = require("../format/Structure");
var Space_1 = require("../space/Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var Content_1 = require("./Content");
var ContentEditing_1 = require("./ContentEditing");
/*
write  = データ量が増加するか、同じデータ量でデータが変化すること
remove = データ量が減少すること

                 | remove some field | remove none
write some field | remove            | write
write none       | remove            | null
*/
var ContentChangeType;
(function (ContentChangeType) {
    ContentChangeType["INITIAL"] = "initial";
    ContentChangeType["WRITE"] = "write";
    ContentChangeType["REMOVE"] = "remove";
})(ContentChangeType = exports.ContentChangeType || (exports.ContentChangeType = {}));
var ContentDraft = /** @class */ (function () {
    function ContentDraft() {
    }
    ContentDraft.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], ContentDraft.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentEditing_1.ContentEditing; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "currentEditingId" }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "currentEditing", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "currentEditingId", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(contentId, intendedSpaceId)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "not_null_constrain", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content_1.Content; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "contentId" }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "contentId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "intendedSpaceId" }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "intendedSpace", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "intendedSpaceId", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(contentId, -createdAt)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "unique_by_user_constrain", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], ContentDraft.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "userId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ContentChangeType,
            default: ContentChangeType.INITIAL
        }),
        __metadata("design:type", String)
    ], ContentDraft.prototype, "changeType", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false, nullable: true }),
        __metadata("design:type", Object)
    ], ContentDraft.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure_1.Structure; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "structureId" }),
        __metadata("design:type", Structure_1.Structure)
    ], ContentDraft.prototype, "structure", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "structureId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], ContentDraft.prototype, "createdAt", void 0);
    __decorate([
        Utils_1.DateColumn(),
        __metadata("design:type", Date)
    ], ContentDraft.prototype, "updatedAtOnlyContent", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentDraft.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentDraft.prototype, "onInsert", null);
    ContentDraft = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["unique_by_user_constrain", "user"])
    ], ContentDraft);
    return ContentDraft;
}());
exports.ContentDraft = ContentDraft;
//# sourceMappingURL=ContentDraft.js.map