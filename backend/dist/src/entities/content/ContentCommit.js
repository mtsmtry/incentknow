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
exports.ContentCommit = void 0;
var typeorm_1 = require("typeorm");
var Structure_1 = require("../format/Structure");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var Content_1 = require("./Content");
var ContentEditing_1 = require("./ContentEditing");
var ContentCommit = /** @class */ (function () {
    function ContentCommit() {
    }
    ContentCommit_1 = ContentCommit;
    ContentCommit.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    var ContentCommit_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentCommit.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], ContentCommit.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content_1.Content; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "contentId" }),
        __metadata("design:type", Content_1.Content)
    ], ContentCommit.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentCommit.prototype, "contentId", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false }),
        __metadata("design:type", Object)
    ], ContentCommit.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure_1.Structure; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "structureId" }),
        __metadata("design:type", Structure_1.Structure)
    ], ContentCommit.prototype, "structure", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentCommit.prototype, "structureId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentEditing_1.ContentEditing; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "editingId" }),
        __metadata("design:type", Object)
    ], ContentCommit.prototype, "editing", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], ContentCommit.prototype, "editingId", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentCommit.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentCommit_1; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "basedCommitId" }),
        __metadata("design:type", Object)
    ], ContentCommit.prototype, "basedCommit", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], ContentCommit.prototype, "basedCommitId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "committerUserId" }),
        __metadata("design:type", User_1.User)
    ], ContentCommit.prototype, "committerUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentCommit.prototype, "committerUserId", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentCommit.prototype, "onInsert", null);
    ContentCommit = ContentCommit_1 = __decorate([
        typeorm_1.Entity()
    ], ContentCommit);
    return ContentCommit;
}());
exports.ContentCommit = ContentCommit;
//# sourceMappingURL=ContentCommit.js.map