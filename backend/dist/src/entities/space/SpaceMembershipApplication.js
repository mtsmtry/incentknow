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
exports.SpaceMembershipApplication = void 0;
var typeorm_1 = require("typeorm");
var Space_1 = require("./Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var SpaceMembershipApplication = /** @class */ (function () {
    function SpaceMembershipApplication() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], SpaceMembershipApplication.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "spaceId" }),
        __metadata("design:type", Space_1.Space)
    ], SpaceMembershipApplication.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], SpaceMembershipApplication.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], SpaceMembershipApplication.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], SpaceMembershipApplication.prototype, "userId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], SpaceMembershipApplication.prototype, "appliedAt", void 0);
    SpaceMembershipApplication = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["space", "user"])
    ], SpaceMembershipApplication);
    return SpaceMembershipApplication;
}());
exports.SpaceMembershipApplication = SpaceMembershipApplication;
//# sourceMappingURL=SpaceMembershipApplication.js.map