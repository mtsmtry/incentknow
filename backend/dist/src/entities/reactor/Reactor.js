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
exports.Reactor = exports.ReactorState = void 0;
var typeorm_1 = require("typeorm");
var Container_1 = require("../container/Container");
var Content_1 = require("../content/Content");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
var ReactorState;
(function (ReactorState) {
    ReactorState["INVAILD"] = "invaild";
})(ReactorState = exports.ReactorState || (exports.ReactorState = {}));
var Reactor = /** @class */ (function () {
    function Reactor() {
    }
    Reactor.prototype.onInsert = function () {
        this.entityId = Utils_1.createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Reactor.prototype, "id", void 0);
    __decorate([
        Utils_1.EntityId(),
        __metadata("design:type", String)
    ], Reactor.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Container_1.Container; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn({ name: "containerId" }),
        __metadata("design:type", Container_1.Container)
    ], Reactor.prototype, "container", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Reactor.prototype, "containerId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ReactorState,
            default: ReactorState.INVAILD
        }),
        __metadata("design:type", String)
    ], Reactor.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Content_1.Content; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn({ name: "definitionId" }),
        __metadata("design:type", Object)
    ], Reactor.prototype, "definition", void 0);
    __decorate([
        typeorm_1.Column("int", { nullable: true }),
        __metadata("design:type", Object)
    ], Reactor.prototype, "definitionId", void 0);
    __decorate([
        Utils_1.CreatedAt(),
        __metadata("design:type", Date)
    ], Reactor.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, { onDelete: "RESTRICT" }),
        typeorm_1.JoinColumn({ name: "creatorUserId" }),
        __metadata("design:type", User_1.User)
    ], Reactor.prototype, "creatorUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Reactor.prototype, "creatorUserId", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Reactor.prototype, "onInsert", null);
    Reactor = __decorate([
        typeorm_1.Entity()
    ], Reactor);
    return Reactor;
}());
exports.Reactor = Reactor;
//# sourceMappingURL=Reactor.js.map