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
exports.Space = exports.SpaceAuth = exports.MembershipMethod = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var SpaceFollow_1 = require("./SpaceFollow");
var MembershipMethod;
(function (MembershipMethod) {
    MembershipMethod["NONE"] = "none";
    MembershipMethod["APP"] = "app";
})(MembershipMethod = exports.MembershipMethod || (exports.MembershipMethod = {}));
var SpaceAuth;
(function (SpaceAuth) {
    SpaceAuth["NONE"] = "none";
    SpaceAuth["VISIBLE"] = "visible";
    SpaceAuth["READABLE"] = "readable";
    SpaceAuth["WRITABLE"] = "writable";
})(SpaceAuth = exports.SpaceAuth || (exports.SpaceAuth = {}));
var Space = /** @class */ (function () {
    function Space() {
    }
    Space.prototype.onInsert = function () {
        this.displayId = Utils_1.createDisplayId();
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Space.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Space.prototype, "entityId", void 0);
    __decorate([
        Utils_1.DisplayId(),
        __metadata("design:type", String)
    ], Space.prototype, "displayId", void 0);
    __decorate([
        Utils_1.DisplayName(),
        __metadata("design:type", String)
    ], Space.prototype, "displayName", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Space.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "creatorUserId" }),
        __metadata("design:type", User_1.User)
    ], Space.prototype, "creatorUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Space.prototype, "creatorUserId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Space.prototype, "description", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 100, nullable: true }),
        __metadata("design:type", Object)
    ], Space.prototype, "homeUrl", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MembershipMethod,
            default: MembershipMethod.NONE
        }),
        __metadata("design:type", String)
    ], Space.prototype, "membershipMethod", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], Space.prototype, "published", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: SpaceAuth,
            default: SpaceAuth.NONE
        }),
        __metadata("design:type", String)
    ], Space.prototype, "defaultAuthority", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return SpaceFollow_1.SpaceFollow; }, function (strc) { return strc.spaceId; }, { onDelete: "CASCADE" }),
        __metadata("design:type", Array)
    ], Space.prototype, "followers", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Space.prototype, "onInsert", null);
    Space = __decorate([
        typeorm_1.Entity()
    ], Space);
    return Space;
}());
exports.Space = Space;
//# sourceMappingURL=Space.js.map