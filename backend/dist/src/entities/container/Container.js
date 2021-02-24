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
exports.Container = exports.ContentGenerator = void 0;
var typeorm_1 = require("typeorm");
var Format_1 = require("../format/Format");
var Space_1 = require("../space/Space");
var Utils_1 = require("../Utils");
var ContentGenerator;
(function (ContentGenerator) {
    ContentGenerator["NONE"] = "none";
    ContentGenerator["REACTOR"] = "reactor";
    ContentGenerator["CRAWLER"] = "crawler";
})(ContentGenerator = exports.ContentGenerator || (exports.ContentGenerator = {}));
var Container = /** @class */ (function () {
    function Container() {
    }
    Container.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Container.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Container.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "RESTRICT", nullable: false }),
        typeorm_1.JoinColumn({ name: "spaceId" }),
        __metadata("design:type", Space_1.Space)
    ], Container.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Container.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format_1.Format; }, { onDelete: "RESTRICT", nullable: false }),
        typeorm_1.JoinColumn({ name: "formatId" }),
        __metadata("design:type", Format_1.Format)
    ], Container.prototype, "format", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Container.prototype, "formatId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Container.prototype, "createdAt", void 0);
    __decorate([
        Utils_1.UpdatedAt(),
        __metadata("design:type", Date)
    ], Container.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ContentGenerator,
            nullable: true
        }),
        __metadata("design:type", Object)
    ], Container.prototype, "generator", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Container.prototype, "onInsert", null);
    Container = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["space", "format"])
    ], Container);
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=Container.js.map