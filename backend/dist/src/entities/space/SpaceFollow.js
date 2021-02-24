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
exports.SpaceFollow = void 0;
var typeorm_1 = require("typeorm");
var Space_1 = require("./Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var SpaceFollow = /** @class */ (function () {
    function SpaceFollow() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], SpaceFollow.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "spaceId" }),
        __metadata("design:type", Space_1.Space)
    ], SpaceFollow.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], SpaceFollow.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], SpaceFollow.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], SpaceFollow.prototype, "userId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], SpaceFollow.prototype, "followedAt", void 0);
    SpaceFollow = __decorate([
        typeorm_1.Entity()
    ], SpaceFollow);
    return SpaceFollow;
}());
exports.SpaceFollow = SpaceFollow;
//# sourceMappingURL=SpaceFollow.js.map