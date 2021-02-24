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
exports.MaterialSnapshot = void 0;
var typeorm_1 = require("typeorm");
var Utils_1 = require("../Utils");
var MaterialDraft_1 = require("./MaterialDraft");
var MaterialEditing_1 = require("./MaterialEditing");
// Index: material -> ownerUser -> timestamp
var MaterialSnapshot = /** @class */ (function () {
    function MaterialSnapshot() {
    }
    MaterialSnapshot.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialSnapshot.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], MaterialSnapshot.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialDraft_1.MaterialDraft; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "draftId" }),
        __metadata("design:type", MaterialDraft_1.MaterialDraft)
    ], MaterialSnapshot.prototype, "draft", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialSnapshot.prototype, "draftId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialEditing_1.MaterialEditing; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "editingId" }),
        __metadata("design:type", MaterialEditing_1.MaterialEditing)
    ], MaterialSnapshot.prototype, "editing", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MaterialSnapshot.prototype, "editingId", void 0);
    __decorate([
        typeorm_1.Column({ select: false }),
        __metadata("design:type", String)
    ], MaterialSnapshot.prototype, "data", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "char_length(`data`)", generatedType: "STORED" }),
        __metadata("design:type", Number)
    ], MaterialSnapshot.prototype, "dataSize", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], MaterialSnapshot.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MaterialSnapshot.prototype, "onInsert", null);
    MaterialSnapshot = __decorate([
        typeorm_1.Entity()
    ], MaterialSnapshot);
    return MaterialSnapshot;
}());
exports.MaterialSnapshot = MaterialSnapshot;
//# sourceMappingURL=MaterialSnapshot.js.map