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
exports.User = void 0;
var typeorm_1 = require("typeorm");
var Utils_1 = require("../Utils");
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.onInsert = function () {
        this.displayId = Utils_1.createDisplayId();
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], User.prototype, "entityId", void 0);
    __decorate([
        Utils_1.DisplayId(),
        __metadata("design:type", String)
    ], User.prototype, "displayId", void 0);
    __decorate([
        Utils_1.DisplayName(),
        __metadata("design:type", String)
    ], User.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.Column("char", { length: 60, select: false }),
        __metadata("design:type", String)
    ], User.prototype, "passwordHash", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 255, unique: true, select: false }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 100, nullable: true }),
        __metadata("design:type", Object)
    ], User.prototype, "iconUrl", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], User.prototype, "onInsert", null);
    User = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map