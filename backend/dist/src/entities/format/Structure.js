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
exports.Structure = void 0;
var typeorm_1 = require("typeorm");
var Utils_1 = require("../Utils");
var Format_1 = require("./Format");
var Property_1 = require("./Property");
// 所有者: Format
var Structure = /** @class */ (function () {
    function Structure() {
    }
    Structure.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Structure.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Structure.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format_1.Format; }, function (format) { return format.structures; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "formatId" }),
        __metadata("design:type", Format_1.Format)
    ], Structure.prototype, "format", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Structure.prototype, "formatId", void 0);
    __decorate([
        typeorm_1.ManyToMany(function (type) { return Property_1.Property; }, { onDelete: "CASCADE", cascade: true }),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], Structure.prototype, "properties", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Structure.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Structure.prototype, "onInsert", null);
    Structure = __decorate([
        typeorm_1.Entity()
    ], Structure);
    return Structure;
}());
exports.Structure = Structure;
//# sourceMappingURL=Structure.js.map