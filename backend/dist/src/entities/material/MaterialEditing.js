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
exports.MaterialEditing = exports.MaterialEditingState = void 0;
var typeorm_1 = require("typeorm");
var ContentEditing_1 = require("../content/ContentEditing");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var MaterialCommit_1 = require("./MaterialCommit");
var MaterialDraft_1 = require("./MaterialDraft");
var MaterialSnapshot_1 = require("./MaterialSnapshot");
var MaterialEditingState;
(function (MaterialEditingState) {
    MaterialEditingState["EDITING"] = "editing";
    MaterialEditingState["COMMITTED"] = "committed";
    MaterialEditingState["CANCELD"] = "canceled";
})(MaterialEditingState = exports.MaterialEditingState || (exports.MaterialEditingState = {}));
var MaterialEditing = /** @class */ (function () {
    function MaterialEditing() {
    }
    MaterialEditing.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialEditing.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], MaterialEditing.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialDraft_1.MaterialDraft; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "draftId" }),
        __metadata("design:type", MaterialDraft_1.MaterialDraft)
    ], MaterialEditing.prototype, "draft", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialEditing.prototype, "draftId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentEditing_1.ContentEditing; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "parentEditingId" }),
        __metadata("design:type", Object)
    ], MaterialEditing.prototype, "parentEditing", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialEditing.prototype, "parentEditingId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], MaterialEditing.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialEditing.prototype, "userId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], MaterialEditing.prototype, "createdAt", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], MaterialEditing.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialCommit_1.MaterialCommit; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "basedCommitId" }),
        __metadata("design:type", Object)
    ], MaterialEditing.prototype, "basedCommit", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], MaterialEditing.prototype, "basedCommitId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MaterialEditingState,
            default: MaterialEditingState.EDITING
        }),
        __metadata("design:type", String)
    ], MaterialEditing.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return MaterialSnapshot_1.MaterialSnapshot; }, function (x) { return x.draft; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], MaterialEditing.prototype, "snapshots", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MaterialEditing.prototype, "onInsert", null);
    MaterialEditing = __decorate([
        typeorm_1.Entity()
    ], MaterialEditing);
    return MaterialEditing;
}());
exports.MaterialEditing = MaterialEditing;
//# sourceMappingURL=MaterialEditing.js.map