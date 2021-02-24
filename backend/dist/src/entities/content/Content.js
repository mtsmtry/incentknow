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
exports.Content = void 0;
var typeorm_1 = require("typeorm");
var Container_1 = require("../container/Container");
var Structure_1 = require("../format/Structure");
var Material_1 = require("../material/Material");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var ContentCommit_1 = require("./ContentCommit");
/*
    Content: 現時点におけるコンテンツの実体
    ContentDraft: あるユーザーがコンテンツの編集について保持するあらゆる情報
    ContentEditing: コンテンツをコミットするまでの一連の編集プロセス
    ContentSnapshot: 自動保存されるコンテンツのデータ

*/
var Content = /** @class */ (function () {
    function Content() {
    }
    Content.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Content.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Content.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false }),
        __metadata("design:type", Object)
    ], Content.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Container_1.Container; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "containerId" }),
        __metadata("design:type", Container_1.Container)
    ], Content.prototype, "container", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Content.prototype, "containerId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure_1.Structure; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "structureId" }),
        __metadata("design:type", Structure_1.Structure)
    ], Content.prototype, "structure", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Content.prototype, "structureId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Content.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "creatorUserId" }),
        __metadata("design:type", User_1.User)
    ], Content.prototype, "creatorUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Content.prototype, "creatorUserId", void 0);
    __decorate([
        Utils_1.DateColumn(),
        __metadata("design:type", Date)
    ], Content.prototype, "updatedAtOnlyData", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], Content.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "updaterUserId" }),
        __metadata("design:type", User_1.User)
    ], Content.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Content.prototype, "updaterUserId", void 0);
    __decorate([
        typeorm_1.Column({ default: 1 }),
        __metadata("design:type", Number)
    ], Content.prototype, "updateCount", void 0);
    __decorate([
        typeorm_1.Column({ default: 0 }),
        __metadata("design:type", Number)
    ], Content.prototype, "viewCount", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return ContentCommit_1.ContentCommit; }, function (strc) { return strc.content; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], Content.prototype, "commits", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Material_1.Material; }, function (mat) { return mat.content; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], Content.prototype, "materials", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Content.prototype, "onInsert", null);
    Content = __decorate([
        typeorm_1.Entity()
    ], Content);
    return Content;
}());
exports.Content = Content;
//# sourceMappingURL=Content.js.map