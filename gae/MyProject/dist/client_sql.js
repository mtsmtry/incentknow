"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.MaterialSnapshot = exports.MaterialEditing = exports.MaterialDraft = exports.MaterialCommit = exports.Material = exports.MaterialType = exports.ContentSnapshot = exports.ContentEditing = exports.ContentDraft = exports.ChangeType = exports.DraftState = exports.EditingState = exports.ContentCommit = exports.Content = exports.Structure = exports.Property = exports.Language = exports.TypeName = exports.Format = exports.ContentGenerator = exports.FormatUsage = exports.Container = exports.SpaceMembershipApplication = exports.SpaceFollow = exports.SpaceMember = exports.MemberType = exports.Reactor = exports.ReactorState = exports.Crawler = exports.Space = exports.SpaceAuth = exports.MembershipMethod = exports.User = void 0;
var typeorm_1 = require("typeorm");
var crypto = require("crypto");
var bcrypt = require("bcrypt");
function DisplayId() {
    return typeorm_1.Column("varchar", { length: 15, unique: true });
}
function EntityId(length) {
    if (length === void 0) { length = 12; }
    return typeorm_1.Column("char", { length: length, unique: true });
}
function DisplayName() {
    return typeorm_1.Column("varchar", { length: 50 });
}
function createEntityId() {
    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var N = 12;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map(function (n) { return S[n % S.length]; }).join('');
}
function createDisplayId() {
    var S = "0123456789";
    var N = 15;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map(function (n) { return S[n % S.length]; }).join('');
}
function CreatedAt() {
    return typeorm_1.CreateDateColumn({ precision: 0, default: function () { return 'NOW()'; } });
}
function UpdatedAt() {
    return typeorm_1.UpdateDateColumn({ precision: 0, default: function () { return 'NOW()'; } });
}
/*

id: RDBのJoin用に用いられる, サーバー外では使用しない
displayId: ユーザーが設定する
entityId: mongoDbの保存に用いられる

new関数: DBの制約上insert時に必要十分な値

*/
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User_1 = User;
    User.new = function (email, displayName, password) {
        return User_1.create({
            email: email,
            displayName: displayName,
            passwordHash: bcrypt.hashSync(password, 10)
        });
    };
    User.prototype.onInsert = function () {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    };
    var User_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], User.prototype, "entityId", void 0);
    __decorate([
        DisplayId(),
        __metadata("design:type", String)
    ], User.prototype, "displayId", void 0);
    __decorate([
        DisplayName(),
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
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "iconUrl", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], User.prototype, "onInsert", null);
    User = User_1 = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}(typeorm_1.BaseEntity));
exports.User = User;
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
var Space = /** @class */ (function (_super) {
    __extends(Space, _super);
    function Space() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Space_1 = Space;
    Space.new = function (creatorUserId, displayName, description) {
        return Space_1.create({
            displayName: displayName,
            description: description,
            creatorUser: User.create({ id: creatorUserId })
        });
    };
    Space.prototype.onInsert = function () {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    };
    var Space_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Space.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Space.prototype, "entityId", void 0);
    __decorate([
        DisplayId(),
        __metadata("design:type", String)
    ], Space.prototype, "displayId", void 0);
    __decorate([
        DisplayName(),
        __metadata("design:type", String)
    ], Space.prototype, "displayName", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Space.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "SET NULL" }),
        __metadata("design:type", User)
    ], Space.prototype, "creatorUser", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Space.prototype, "description", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", String)
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
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Space.prototype, "onInsert", null);
    Space = Space_1 = __decorate([
        typeorm_1.Entity()
    ], Space);
    return Space;
}(typeorm_1.BaseEntity));
exports.Space = Space;
var Crawler = /** @class */ (function (_super) {
    __extends(Crawler, _super);
    function Crawler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Crawler.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Crawler.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Crawler.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Content; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Content)
    ], Crawler.prototype, "definition", void 0);
    __decorate([
        DisplayName(),
        __metadata("design:type", String)
    ], Crawler.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Space)
    ], Crawler.prototype, "space", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Crawler.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", User)
    ], Crawler.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Crawler.prototype, "onInsert", null);
    Crawler = __decorate([
        typeorm_1.Entity()
    ], Crawler);
    return Crawler;
}(typeorm_1.BaseEntity));
exports.Crawler = Crawler;
var ReactorState;
(function (ReactorState) {
    ReactorState["INVAILD"] = "invaild";
})(ReactorState = exports.ReactorState || (exports.ReactorState = {}));
var Reactor = /** @class */ (function (_super) {
    __extends(Reactor, _super);
    function Reactor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Reactor.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Reactor.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Reactor.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Space)
    ], Reactor.prototype, "space", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Format)
    ], Reactor.prototype, "format", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ReactorState,
            default: ReactorState.INVAILD
        }),
        __metadata("design:type", String)
    ], Reactor.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Content; }, { onDelete: "SET NULL", nullable: true }),
        __metadata("design:type", Content)
    ], Reactor.prototype, "definition", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Reactor.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Reactor.prototype, "creatorUser", void 0);
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
}(typeorm_1.BaseEntity));
exports.Reactor = Reactor;
var MemberType;
(function (MemberType) {
    MemberType["NORMAL"] = "normal";
    MemberType["OWNER"] = "owner";
})(MemberType = exports.MemberType || (exports.MemberType = {}));
var SpaceMember = /** @class */ (function (_super) {
    __extends(SpaceMember, _super);
    function SpaceMember() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpaceMember_1 = SpaceMember;
    SpaceMember.new = function (spaceId, userId, type) {
        return SpaceMember_1.create({
            type: type,
            space: Space.create({ id: spaceId }),
            user: User.create({ id: userId })
        });
    };
    var SpaceMember_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], SpaceMember.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Space)
    ], SpaceMember.prototype, "space", void 0);
    __decorate([
        typeorm_1.RelationId(function (member) { return member.space; }),
        __metadata("design:type", Number)
    ], SpaceMember.prototype, "spaceId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], SpaceMember.prototype, "user", void 0);
    __decorate([
        typeorm_1.RelationId(function (member) { return member.user; }),
        __metadata("design:type", Number)
    ], SpaceMember.prototype, "userId", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], SpaceMember.prototype, "joinedAt", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MemberType
        }),
        __metadata("design:type", String)
    ], SpaceMember.prototype, "type", void 0);
    SpaceMember = SpaceMember_1 = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["space", "user"])
    ], SpaceMember);
    return SpaceMember;
}(typeorm_1.BaseEntity));
exports.SpaceMember = SpaceMember;
var SpaceFollow = /** @class */ (function (_super) {
    __extends(SpaceFollow, _super);
    function SpaceFollow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], SpaceFollow.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Space)
    ], SpaceFollow.prototype, "space", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], SpaceFollow.prototype, "user", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], SpaceFollow.prototype, "followedAt", void 0);
    SpaceFollow = __decorate([
        typeorm_1.Entity()
    ], SpaceFollow);
    return SpaceFollow;
}(typeorm_1.BaseEntity));
exports.SpaceFollow = SpaceFollow;
var SpaceMembershipApplication = /** @class */ (function (_super) {
    __extends(SpaceMembershipApplication, _super);
    function SpaceMembershipApplication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpaceMembershipApplication.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], SpaceMembershipApplication.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], SpaceMembershipApplication.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Space)
    ], SpaceMembershipApplication.prototype, "space", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], SpaceMembershipApplication.prototype, "user", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], SpaceMembershipApplication.prototype, "appliedAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SpaceMembershipApplication.prototype, "onInsert", null);
    SpaceMembershipApplication = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["space", "user"])
    ], SpaceMembershipApplication);
    return SpaceMembershipApplication;
}(typeorm_1.BaseEntity));
exports.SpaceMembershipApplication = SpaceMembershipApplication;
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container_1 = Container;
    Container.new = function (spaceId, formatId) {
        return Container_1.create({
            space: Space.create({ id: spaceId }),
            format: Format.create({ id: formatId })
        });
    };
    Container.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    var Container_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Container.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Container.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Space)
    ], Container.prototype, "space", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Format)
    ], Container.prototype, "format", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Container.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Container.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Container.prototype, "onInsert", null);
    Container = Container_1 = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["space", "format"])
    ], Container);
    return Container;
}(typeorm_1.BaseEntity));
exports.Container = Container;
var FormatUsage;
(function (FormatUsage) {
    FormatUsage["INTERNAL"] = "internal";
    FormatUsage["EXTERNAL"] = "external";
})(FormatUsage = exports.FormatUsage || (exports.FormatUsage = {}));
var ContentGenerator;
(function (ContentGenerator) {
    ContentGenerator["REACTOR"] = "reactor";
    ContentGenerator["CRAWLER"] = "crawler";
})(ContentGenerator = exports.ContentGenerator || (exports.ContentGenerator = {}));
var Format = /** @class */ (function (_super) {
    __extends(Format, _super);
    function Format() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Format_1 = Format;
    Format.new = function (creatorUserId, spaceId, displayName, description, usage) {
        return Format_1.create({
            displayName: displayName,
            description: description,
            usage: usage,
            space: Space.create({ id: spaceId }),
            creatorUser: User.create({ id: creatorUserId }),
            updaterUser: User.create({ id: creatorUserId })
        });
    };
    Format.prototype.onInsert = function () {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    };
    var Format_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Format.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Format.prototype, "entityId", void 0);
    __decorate([
        DisplayId(),
        __metadata("design:type", String)
    ], Format.prototype, "displayId", void 0);
    __decorate([
        DisplayName(),
        __metadata("design:type", String)
    ], Format.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "RESTRICT", nullable: false }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", Space)
    ], Format.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Format.prototype, "description", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ContentGenerator,
            nullable: true
        }),
        __metadata("design:type", String)
    ], Format.prototype, "generator", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Structure; }, { onDelete: "SET NULL" }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", Structure)
    ], Format.prototype, "currentStructure", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: FormatUsage
        }),
        __metadata("design:type", String)
    ], Format.prototype, "usage", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Format.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Format.prototype, "creatorUser", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Format.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Format.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Structure; }, function (strc) { return strc.format; }, { onDelete: "CASCADE" }),
        __metadata("design:type", Array)
    ], Format.prototype, "structures", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Property; }, function (prop) { return prop.format; }, { onDelete: "CASCADE", cascade: ["insert"] }),
        __metadata("design:type", Array)
    ], Format.prototype, "properties", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Format.prototype, "onInsert", null);
    Format = Format_1 = __decorate([
        typeorm_1.Entity()
    ], Format);
    return Format;
}(typeorm_1.BaseEntity));
exports.Format = Format;
var TypeName;
(function (TypeName) {
    TypeName["INT"] = "integer";
    TypeName["BOOL"] = "boolean";
    TypeName["STRING"] = "string";
    TypeName["FORMAT"] = "format";
    TypeName["SPACE"] = "space";
    TypeName["CONTENT"] = "content";
    TypeName["URL"] = "url";
    TypeName["OBJECT"] = "object";
    TypeName["TEXT"] = "text";
    TypeName["ARRAY"] = "array";
    TypeName["CODE"] = "code";
})(TypeName = exports.TypeName || (exports.TypeName = {}));
var Language;
(function (Language) {
    Language["PYTHON"] = "python";
    Language["JAVASCRIPT"] = "javascript";
})(Language = exports.Language || (exports.Language = {}));
// 所有者: Format
var Property = /** @class */ (function (_super) {
    __extends(Property, _super);
    function Property() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Property_1 = Property;
    Property.new = function (formatId, parentPropertyId, entityId, displayName, typeName, order) {
        return Property_1.create({
            order: order,
            displayName: displayName,
            entityId: entityId,
            typeName: typeName,
            parentProperty: parentPropertyId ? Property_1.create({ id: parentPropertyId }) : null,
            format: Format.create({ id: formatId })
        });
    };
    var Property_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Property.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column("char", { length: 2 }),
        __metadata("design:type", String)
    ], Property.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, function (format) { return format.properties; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Format)
    ], Property.prototype, "format", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Property_1; }, function (prop) { return prop.argProperties; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Property)
    ], Property.prototype, "parentProperty", void 0);
    __decorate([
        DisplayName(),
        __metadata("design:type", String)
    ], Property.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Property.prototype, "fieldName", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Property.prototype, "semantic", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], Property.prototype, "optional", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Property.prototype, "order", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: TypeName
        }),
        __metadata("design:type", String)
    ], Property.prototype, "typeName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Container; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Format)
    ], Property.prototype, "argFormat", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: TypeName,
            nullable: true
        }),
        __metadata("design:type", String)
    ], Property.prototype, "argType", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: Language,
            nullable: true
        }),
        __metadata("design:type", String)
    ], Property.prototype, "argLanguage", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Property_1; }, function (prop) { return prop.parentProperty; }),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], Property.prototype, "argProperties", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Property.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Property.prototype, "updatedAt", void 0);
    Property = Property_1 = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["format", "parentProperty", "order"]),
        typeorm_1.Unique(["format", "entityId"])
    ], Property);
    return Property;
}(typeorm_1.BaseEntity));
exports.Property = Property;
// 所有者: Format
var Structure = /** @class */ (function (_super) {
    __extends(Structure, _super);
    function Structure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Structure_1 = Structure;
    Structure.new = function (formatId, properties) {
        return Structure_1.create({
            properties: properties,
            format: Format.create({ id: formatId })
        });
    };
    Structure.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    var Structure_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Structure.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Structure.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, function (format) { return format.structures; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Format)
    ], Structure.prototype, "format", void 0);
    __decorate([
        typeorm_1.RelationId(function (strc) { return strc.format; }),
        __metadata("design:type", Number)
    ], Structure.prototype, "formatId", void 0);
    __decorate([
        typeorm_1.ManyToMany(function (type) { return Property; }, { onDelete: "CASCADE", cascade: true }),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], Structure.prototype, "properties", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Structure.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Structure.prototype, "onInsert", null);
    Structure = Structure_1 = __decorate([
        typeorm_1.Entity()
    ], Structure);
    return Structure;
}(typeorm_1.BaseEntity));
exports.Structure = Structure;
var Content = /** @class */ (function (_super) {
    __extends(Content, _super);
    function Content() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Content_1 = Content;
    Content.new = function (containerId, structureId, creatorUserId) {
        return Content_1.create({
            container: Container.create({ id: containerId }),
            structure: Container.create({ id: containerId }),
            creatorUser: User.create({ id: containerId }),
            updaterUser: User.create({ id: containerId }),
        });
    };
    Content.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    var Content_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Content.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Content.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Container; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Container)
    ], Content.prototype, "container", void 0);
    __decorate([
        typeorm_1.RelationId(function (content) { return content.container; }),
        __metadata("design:type", Number)
    ], Content.prototype, "containerId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], Content.prototype, "structure", void 0);
    __decorate([
        typeorm_1.RelationId(function (content) { return content.structure; }),
        __metadata("design:type", Number)
    ], Content.prototype, "structureId", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Material; }, function (mat) { return mat.content; }),
        __metadata("design:type", Array)
    ], Content.prototype, "materials", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Content.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Content.prototype, "creatorUser", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Content.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Content.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.Column({ default: 0 }),
        __metadata("design:type", Number)
    ], Content.prototype, "viewCount", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return ContentCommit; }, function (strc) { return strc.content; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], Content.prototype, "commits", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Content.prototype, "onInsert", null);
    Content = Content_1 = __decorate([
        typeorm_1.Entity()
    ], Content);
    return Content;
}(typeorm_1.BaseEntity));
exports.Content = Content;
var ContentCommit = /** @class */ (function (_super) {
    __extends(ContentCommit, _super);
    function ContentCommit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentCommit_1 = ContentCommit;
    ContentCommit.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    var ContentCommit_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentCommit.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], ContentCommit.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Content)
    ], ContentCommit.prototype, "content", void 0);
    __decorate([
        typeorm_1.RelationId(function (x) { return x.content; }),
        __metadata("design:type", Number)
    ], ContentCommit.prototype, "contentId", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false }),
        __metadata("design:type", Object)
    ], ContentCommit.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], ContentCommit.prototype, "structure", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentCommit.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentCommit_1; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentCommit)
    ], ContentCommit.prototype, "forkedCommit", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], ContentCommit.prototype, "committerUser", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentCommit.prototype, "onInsert", null);
    ContentCommit = ContentCommit_1 = __decorate([
        typeorm_1.Entity()
    ], ContentCommit);
    return ContentCommit;
}(typeorm_1.BaseEntity));
exports.ContentCommit = ContentCommit;
var EditingState;
(function (EditingState) {
    EditingState["EDITING"] = "editing";
    EditingState["COMMITTED"] = "committed";
    EditingState["CANCELD"] = "canceled";
})(EditingState = exports.EditingState || (exports.EditingState = {}));
var DraftState;
(function (DraftState) {
    DraftState["EDITING"] = "editing";
})(DraftState = exports.DraftState || (exports.DraftState = {}));
/*
write  = データ量が増加するか、同じデータ量でデータが変化すること
remove = データ量が減少すること

                 | remove some field | remove none
write some field | remove            | write
write none       | remove            | null
*/
var ChangeType;
(function (ChangeType) {
    ChangeType["INITIAL"] = "initial";
    ChangeType["WRITE"] = "write";
    ChangeType["REMOVE"] = "remove";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
var ContentDraft = /** @class */ (function (_super) {
    __extends(ContentDraft, _super);
    function ContentDraft() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentDraft.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], ContentDraft.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentEditing; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentEditing)
    ], ContentDraft.prototype, "currentEditing", void 0);
    __decorate([
        typeorm_1.RelationId(function (x) { return x.currentEditing; }),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "currentEditingId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Content)
    ], ContentDraft.prototype, "content", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Space)
    ], ContentDraft.prototype, "intededSpace", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(contentId, intededSpaceId)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "not_null_constrain", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(contentId, -createdAt)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], ContentDraft.prototype, "unique_by_user_constrain", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], ContentDraft.prototype, "user", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentCommit; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentCommit)
    ], ContentDraft.prototype, "forkedCommit", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ChangeType,
            default: ChangeType.INITIAL
        }),
        __metadata("design:type", String)
    ], ContentDraft.prototype, "changeType", void 0);
    __decorate([
        typeorm_1.Column({ select: false, nullable: true }),
        __metadata("design:type", String)
    ], ContentDraft.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], ContentDraft.prototype, "structure", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: EditingState,
            default: EditingState.EDITING
        }),
        __metadata("design:type", String)
    ], ContentDraft.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return ContentSnapshot; }, function (x) { return x.draft; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], ContentDraft.prototype, "snapshots", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], ContentDraft.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentDraft.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentDraft.prototype, "onInsert", null);
    ContentDraft = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["unique_by_user_constrain", "user"])
    ], ContentDraft);
    return ContentDraft;
}(typeorm_1.BaseEntity));
exports.ContentDraft = ContentDraft;
var ContentEditing = /** @class */ (function (_super) {
    __extends(ContentEditing, _super);
    function ContentEditing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentEditing.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], ContentEditing.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentDraft; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", ContentDraft)
    ], ContentEditing.prototype, "draft", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], ContentEditing.prototype, "user", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], ContentEditing.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentEditing.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentCommit; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentCommit)
    ], ContentEditing.prototype, "forkedCommit", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: EditingState,
            default: EditingState.EDITING
        }),
        __metadata("design:type", String)
    ], ContentEditing.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return MaterialSnapshot; }, function (x) { return x.draft; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], ContentEditing.prototype, "snapshots", void 0);
    ContentEditing = __decorate([
        typeorm_1.Entity()
    ], ContentEditing);
    return ContentEditing;
}(typeorm_1.BaseEntity));
exports.ContentEditing = ContentEditing;
var ContentSnapshot = /** @class */ (function (_super) {
    __extends(ContentSnapshot, _super);
    function ContentSnapshot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentSnapshot.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ContentSnapshot.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], ContentSnapshot.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentDraft; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", ContentDraft)
    ], ContentSnapshot.prototype, "draft", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return ContentEditing; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", ContentEditing)
    ], ContentSnapshot.prototype, "editing", void 0);
    __decorate([
        typeorm_1.Column("simple-json", { select: false }),
        __metadata("design:type", Object)
    ], ContentSnapshot.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], ContentSnapshot.prototype, "structure", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], ContentSnapshot.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ContentSnapshot.prototype, "onInsert", null);
    ContentSnapshot = __decorate([
        typeorm_1.Entity()
    ], ContentSnapshot);
    return ContentSnapshot;
}(typeorm_1.BaseEntity));
exports.ContentSnapshot = ContentSnapshot;
var MaterialType;
(function (MaterialType) {
    MaterialType["FOLDER"] = "folder";
    MaterialType["DOCUMENT"] = "document";
})(MaterialType = exports.MaterialType || (exports.MaterialType = {}));
var Material = /** @class */ (function (_super) {
    __extends(Material, _super);
    function Material() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Material.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Material.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Material.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Content)
    ], Material.prototype, "content", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Space)
    ], Material.prototype, "space", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(contentId, spaceId)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], Material.prototype, "not_null_constrain", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Material.prototype, "displayName", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MaterialType
        }),
        __metadata("design:type", String)
    ], Material.prototype, "materialType", void 0);
    __decorate([
        typeorm_1.Column({ select: false }),
        __metadata("design:type", String)
    ], Material.prototype, "data", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Material.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Material.prototype, "creatorUser", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Material.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], Material.prototype, "updaterUser", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return MaterialCommit; }, function (strc) { return strc.material; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], Material.prototype, "commits", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Material.prototype, "onInsert", null);
    Material = __decorate([
        typeorm_1.Entity()
    ], Material);
    return Material;
}(typeorm_1.BaseEntity));
exports.Material = Material;
var MaterialCommit = /** @class */ (function (_super) {
    __extends(MaterialCommit, _super);
    function MaterialCommit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialCommit_1 = MaterialCommit;
    MaterialCommit.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    var MaterialCommit_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], MaterialCommit.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content; }, { onDelete: "CASCADE", nullable: false }),
        typeorm_1.Index(),
        __metadata("design:type", Material)
    ], MaterialCommit.prototype, "material", void 0);
    __decorate([
        typeorm_1.RelationId(function (x) { return x.material; }),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "materialId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return MaterialEditing; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", MaterialEditing)
    ], MaterialCommit.prototype, "editing", void 0);
    __decorate([
        typeorm_1.RelationId(function (x) { return x.editing; }),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "editingId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentCommit; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentCommit)
    ], MaterialCommit.prototype, "parentCommit", void 0);
    __decorate([
        typeorm_1.Column({ select: false }),
        __metadata("design:type", String)
    ], MaterialCommit.prototype, "data", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "char_length(`data`)", generatedType: "STORED" }),
        __metadata("design:type", Number)
    ], MaterialCommit.prototype, "dataSize", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], MaterialCommit.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialCommit_1; }, { onDelete: "SET NULL" }),
        __metadata("design:type", MaterialCommit)
    ], MaterialCommit.prototype, "forkedCommit", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", User)
    ], MaterialCommit.prototype, "committerUser", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MaterialCommit.prototype, "onInsert", null);
    MaterialCommit = MaterialCommit_1 = __decorate([
        typeorm_1.Entity()
    ], MaterialCommit);
    return MaterialCommit;
}(typeorm_1.BaseEntity));
exports.MaterialCommit = MaterialCommit;
var MaterialDraft = /** @class */ (function (_super) {
    __extends(MaterialDraft, _super);
    function MaterialDraft() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialDraft.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return MaterialEditing; }, { onDelete: "SET NULL" }),
        __metadata("design:type", MaterialEditing)
    ], MaterialDraft.prototype, "currentEditing", void 0);
    __decorate([
        typeorm_1.RelationId(function (x) { return x.currentEditing; }),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "currentEditingId", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: MaterialType,
            nullable: true
        }),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "intendedMaterialType", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "intendedDisplayName", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Material)
    ], MaterialDraft.prototype, "material", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentDraft)
    ], MaterialDraft.prototype, "intendedContentDraft", void 0);
    __decorate([
        typeorm_1.RelationId(function (x) { return x.intendedContentDraft; }),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "intendedContentDraftId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Space)
    ], MaterialDraft.prototype, "intendedSpace", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(materialId, intendedContentDraftId, intendedSpaceId)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "not_null_constrain", void 0);
    __decorate([
        typeorm_1.Column({ asExpression: "coalesce(materialId, -createdAt)", generatedType: "VIRTUAL" }),
        __metadata("design:type", Number)
    ], MaterialDraft.prototype, "unique_by_user_constrain", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], MaterialDraft.prototype, "user", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], MaterialDraft.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], MaterialDraft.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialCommit; }, { onDelete: "SET NULL" }),
        __metadata("design:type", MaterialCommit)
    ], MaterialDraft.prototype, "forkedCommit", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: ChangeType,
            default: ChangeType.INITIAL
        }),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "changeType", void 0);
    __decorate([
        typeorm_1.Column({ select: false, nullable: true }),
        __metadata("design:type", String)
    ], MaterialDraft.prototype, "data", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MaterialDraft.prototype, "onInsert", null);
    MaterialDraft = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Unique(["unique_by_user_constrain", "user"])
    ], MaterialDraft);
    return MaterialDraft;
}(typeorm_1.BaseEntity));
exports.MaterialDraft = MaterialDraft;
var MaterialEditing = /** @class */ (function (_super) {
    __extends(MaterialEditing, _super);
    function MaterialEditing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialEditing.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], MaterialEditing.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialDraft; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", MaterialDraft)
    ], MaterialEditing.prototype, "draft", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return ContentEditing; }, { onDelete: "SET NULL" }),
        __metadata("design:type", ContentEditing)
    ], MaterialEditing.prototype, "parentEditing", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], MaterialEditing.prototype, "user", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], MaterialEditing.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], MaterialEditing.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialCommit; }, { onDelete: "SET NULL" }),
        __metadata("design:type", MaterialCommit)
    ], MaterialEditing.prototype, "forkedCommit", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: EditingState,
            default: EditingState.EDITING
        }),
        __metadata("design:type", String)
    ], MaterialEditing.prototype, "state", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return MaterialSnapshot; }, function (x) { return x.draft; }, { onDelete: "RESTRICT" }),
        __metadata("design:type", Array)
    ], MaterialEditing.prototype, "snapshots", void 0);
    MaterialEditing = __decorate([
        typeorm_1.Entity()
    ], MaterialEditing);
    return MaterialEditing;
}(typeorm_1.BaseEntity));
exports.MaterialEditing = MaterialEditing;
// 制約: 一度作成されると変更されない
// 指針: 永久保存される必要が生じた場合に作成される
// Index: material -> ownerUser -> timestamp
var MaterialSnapshot = /** @class */ (function (_super) {
    __extends(MaterialSnapshot, _super);
    function MaterialSnapshot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialSnapshot.prototype.onInsert = function () {
        this.entityId = createEntityId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], MaterialSnapshot.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], MaterialSnapshot.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialDraft; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", MaterialDraft)
    ], MaterialSnapshot.prototype, "draft", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return MaterialEditing; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", MaterialEditing)
    ], MaterialSnapshot.prototype, "editing", void 0);
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
}(typeorm_1.BaseEntity));
exports.MaterialSnapshot = MaterialSnapshot;
//# sourceMappingURL=client_sql.js.map