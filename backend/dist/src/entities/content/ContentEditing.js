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
exports.ContentEditing = exports.ContentEditingState = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var ContentCommit_1 = require("./ContentCommit");
var ContentDraft_1 = require("./ContentDraft");
var ContentSnapshot_1 = require("./ContentSnapshot");
var ContentEditingState;
(function (ContentEditingState) {
    ContentEditingState["EDITING"] = "editing";
    ContentEditingState["COMMITTED"] = "committed";
    ContentEditingState["CANCELD"] = "canceled";
})(ContentEditingState = exports.ContentEditingState || (exports.ContentEditingState = {}));
var ContentEditing = /** @class */ (function () {
    function ContentEditing() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentEditing.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], ContentEditing.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentDraft_1.ContentDraft; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "draftId" }),
        __metadata("design:type", ContentDraft_1.ContentDraft)
    ], ContentEditing.prototype, "draft", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentEditing.prototype, "draftId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], ContentEditing.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentEditing.prototype, "userId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], ContentEditing.prototype, "createdAt", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentEditing.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentCommit_1.ContentCommit; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "basedCommitId" }),
        __metadata("design:type", Object)
    ], ContentEditing.prototype, "basedCommit", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], ContentEditing.prototype, "basedCommitId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ContentEditingState,
            default: ContentEditingState.EDITING
        }),
        __metadata("design:type", String)
    ], ContentEditing.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return ContentSnapshot_1.ContentSnapshot; }, function (x) { return x.editing; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], ContentEditing.prototype, "snapshots", void 0);
    ContentEditing = __decorate([
        typeorm_1.Entity()
    ], ContentEditing);
    return ContentEditing;
}());
exports.ContentEditing = ContentEditing;
//# sourceMappingURL=ContentEditing.js.map