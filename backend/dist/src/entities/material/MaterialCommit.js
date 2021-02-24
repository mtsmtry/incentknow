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
exports.MaterialCommit = void 0;
var typeorm_1 = require("typeorm");
var Content_1 = require("../content/Content");
var ContentCommit_1 = require("../content/ContentCommit");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var Material_1 = require("./Material");
var MaterialEditing_1 = require("./MaterialEditing");
var MaterialCommit = /** @class */ (function () {
    function MaterialCommit() {
    }
    MaterialCommit_1 = MaterialCommit;
    MaterialCommit.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    var MaterialCommit_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], MaterialCommit.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content_1.Content; }, { onDelete: "CASCADE" }),
        typeorm_1.Index(),
        typeorm_1.JoinColumn({ name: "materialId" }),
        __metadata("design:type", Material_1.Material)
    ], MaterialCommit.prototype, "material", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "materialId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentCommit_1.ContentCommit; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "parentCommitId" }),
        __metadata("design:type", Object)
    ], MaterialCommit.prototype, "parentCommit", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialCommit.prototype, "parentCommitId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return MaterialEditing_1.MaterialEditing; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "editingId" }),
        __metadata("design:type", Object)
    ], MaterialCommit.prototype, "editing", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialCommit.prototype, "editingId", void 0);
    __decorate([
        typeorm_1.Column({ select: false }),
        __metadata("design:type", String)
    ], MaterialCommit.prototype, "data", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "char_length(`data`)", generatedType: "STORED" }),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "dataSize", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], MaterialCommit.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialCommit_1; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "basedCommitId" }),
        __metadata("design:type", Object)
    ], MaterialCommit.prototype, "basedCommit", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialCommit.prototype, "basedCommitId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "committerUserId" }),
        __metadata("design:type", User_1.User)
    ], MaterialCommit.prototype, "committerUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "committerUserId", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MaterialCommit.prototype, "onInsert", null);
    MaterialCommit = MaterialCommit_1 = __decorate([
        typeorm_1.Entity()
    ], MaterialCommit);
    return MaterialCommit;
}());
exports.MaterialCommit = MaterialCommit;
//# sourceMappingURL=MaterialCommit.js.map