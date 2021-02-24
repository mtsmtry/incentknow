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
exports.ContentSnapshot = void 0;
var typeorm_1 = require("typeorm");
var Structure_1 = require("../format/Structure");
var Utils_1 = require("../Utils");
var ContentDraft_1 = require("./ContentDraft");
var ContentEditing_1 = require("./ContentEditing");
var ContentSnapshot = /** @class */ (function () {
    function ContentSnapshot() {
    }
    ContentSnapshot.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentSnapshot.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], ContentSnapshot.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentDraft_1.ContentDraft; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "draftId" }),
        __metadata("design:type", ContentDraft_1.ContentDraft)
    ], ContentSnapshot.prototype, "draft", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentSnapshot.prototype, "draftId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentEditing_1.ContentEditing; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "editingId" }),
        __metadata("design:type", ContentEditing_1.ContentEditing)
    ], ContentSnapshot.prototype, "editing", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentSnapshot.prototype, "editingId", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false }),
        __metadata("design:type", Object)
    ], ContentSnapshot.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure_1.Structure; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "structureId" }),
        __metadata("design:type", Structure_1.Structure)
    ], ContentSnapshot.prototype, "structure", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentSnapshot.prototype, "structureId", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentSnapshot.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentSnapshot.prototype, "onInsert", null);
    ContentSnapshot = __decorate([
        typeorm_1.Entity()
    ], ContentSnapshot);
    return ContentSnapshot;
}());
exports.ContentSnapshot = ContentSnapshot;
//# sourceMappingURL=ContentSnapshot.js.map