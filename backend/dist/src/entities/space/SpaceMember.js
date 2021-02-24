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
exports.SpaceMember = exports.MemberType = void 0;
var typeorm_1 = require("typeorm");
var Space_1 = require("./Space");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var MemberType;
(function (MemberType) {
    MemberType["NORMAL"] = "normal";
    MemberType["OWNER"] = "owner";
})(MemberType = exports.MemberType || (exports.MemberType = {}));
var SpaceMember = /** @class */ (function () {
    function SpaceMember() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], SpaceMember.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space_1.Space; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "spaceId" }),
        __metadata("design:type", Space_1.Space)
    ], SpaceMember.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], SpaceMember.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "userId" }),
        __metadata("design:type", User_1.User)
    ], SpaceMember.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], SpaceMember.prototype, "userId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], SpaceMember.prototype, "joinedAt", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MemberType
        }),
        __metadata("design:type", String)
    ], SpaceMember.prototype, "type", void 0);
    SpaceMember = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["space", "user"])
    ], SpaceMember);
    return SpaceMember;
}());
exports.SpaceMember = SpaceMember;
//# sourceMappingURL=SpaceMember.js.map