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
exports.ContentTransition = void 0;
var typeorm_1 = require("typeorm");
var Structure_1 = require("../format/Structure");
var Utils_1 = require("../Utils");
var ContentTransition = /** @class */ (function () {
    function ContentTransition() {
    }
    ContentTransition.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentTransition.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], ContentTransition.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false }),
        __metadata("design:type", Object)
    ], ContentTransition.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure_1.Structure; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "structureId" }),
        __metadata("design:type", Structure_1.Structure)
    ], ContentTransition.prototype, "structure", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], ContentTransition.prototype, "structureId", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentTransition.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentTransition.prototype, "onInsert", null);
    ContentTransition = __decorate([
        typeorm_1.Entity()
    ], ContentTransition);
    return ContentTransition;
}());
exports.ContentTransition = ContentTransition;
//# sourceMappingURL=ContentTransition.js.map