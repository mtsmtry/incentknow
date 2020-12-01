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
exports.Commit = exports.Work = exports.WorkState = exports.LatestChange = exports.SpaceFollow = exports.Content = exports.Structure = exports.Property = exports.Language = exports.TypeName = exports.Format = exports.ContentGenerator = exports.FormatUsage = exports.Container = exports.SpaceMembershipApplication = exports.SpaceMember = exports.MemberType = exports.Reactor = exports.ReactorState = exports.Crawler = exports.Space = exports.SpaceAuth = exports.MembershipMethod = exports.User = void 0;
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
function genId() {
    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var N = 12;
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
        this.displayId = this.entityId = genId();
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
        typeorm_1.Column("char", { length: 60 }),
        __metadata("design:type", String)
    ], User.prototype, "passwordHash", void 0);
    __decorate([
        typeorm_1.Column("varchar", { length: 255, unique: true }),
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
        this.displayId = this.entityId = genId();
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
        this.entityId = genId();
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
        this.entityId = genId();
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
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], SpaceMember.prototype, "user", void 0);
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
var SpaceMembershipApplication = /** @class */ (function (_super) {
    __extends(SpaceMembershipApplication, _super);
    function SpaceMembershipApplication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpaceMembershipApplication.prototype.onInsert = function () {
        this.entityId = genId();
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
    Container.prototype.onInsert = function () {
        this.entityId = genId();
    };
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
        this.displayId = this.entityId = genId();
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
        this.entityId = genId();
    };
    var Structure_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", String)
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
    Content.new = function (containerId, creatorUserId) {
        var content = new Content_1();
        content.container.id = containerId;
        content.creatorUser.id = creatorUserId;
        content.updaterUser.id = creatorUserId;
        return content;
    };
    Content.prototype.onInsert = function () {
        this.entityId = genId();
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
        typeorm_1.JoinColumn(),
        __metadata("design:type", Container)
    ], Content.prototype, "container", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], Content.prototype, "structure", void 0);
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
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Content.prototype, "updateCount", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Content.prototype, "viewCount", void 0);
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
var LatestChange;
(function (LatestChange) {
    LatestChange["INITIAL"] = "initial";
    LatestChange["COMPLEX"] = "complex";
    LatestChange["INCRESE"] = "increase";
    LatestChange["DECREASE"] = "decrease";
})(LatestChange = exports.LatestChange || (exports.LatestChange = {}));
var WorkState;
(function (WorkState) {
    WorkState["WORKING"] = "working";
    WorkState["COMMITTED"] = "committed";
    WorkState["DELETED"] = "deleted";
})(WorkState = exports.WorkState || (exports.WorkState = {}));
var Work = /** @class */ (function (_super) {
    __extends(Work, _super);
    function Work() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //workingChangeId: string | null;
    Work.prototype.onInsert = function () {
        this.entityId = genId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Work.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Work.prototype, "entityId", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Work.prototype, "createdAt", void 0);
    __decorate([
        UpdatedAt(),
        __metadata("design:type", Date)
    ], Work.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Space)
    ], Work.prototype, "space", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], Work.prototype, "structure", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Format)
    ], Work.prototype, "format", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, { onDelete: "SET NULL" }),
        __metadata("design:type", Content)
    ], Work.prototype, "content", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Format; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", User)
    ], Work.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: LatestChange,
            default: LatestChange.INITIAL
        }),
        __metadata("design:type", String)
    ], Work.prototype, "latestChange", void 0);
    __decorate([
        typeorm_1.Column({
            type: "enum",
            enum: WorkState,
            default: WorkState.WORKING
        }),
        __metadata("design:type", String)
    ], Work.prototype, "state", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Work.prototype, "onInsert", null);
    Work = __decorate([
        typeorm_1.Entity()
    ], Work);
    return Work;
}(typeorm_1.BaseEntity));
exports.Work = Work;
var Commit = /** @class */ (function (_super) {
    __extends(Commit, _super);
    function Commit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Commit.prototype.onInsert = function () {
        this.entityId = genId();
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Commit.prototype, "id", void 0);
    __decorate([
        EntityId(),
        __metadata("design:type", String)
    ], Commit.prototype, "entityId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Content; }, { onDelete: "CASCADE", nullable: false }),
        __metadata("design:type", Content)
    ], Commit.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column("simple-json"),
        __metadata("design:type", Object)
    ], Commit.prototype, "data", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Space; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Space)
    ], Commit.prototype, "space", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Structure; }, { onDelete: "RESTRICT", nullable: false }),
        __metadata("design:type", Structure)
    ], Commit.prototype, "structure", void 0);
    __decorate([
        CreatedAt(),
        __metadata("design:type", Date)
    ], Commit.prototype, "timestamp", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User; }, { onDelete: "RESTRICT", nullable: false }),
        typeorm_1.Index(),
        __metadata("design:type", User)
    ], Commit.prototype, "committer", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Commit.prototype, "version", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Commit.prototype, "onInsert", null);
    Commit = __decorate([
        typeorm_1.Entity()
    ], Commit);
    return Commit;
}(typeorm_1.BaseEntity));
exports.Commit = Commit;
//# sourceMappingURL=sql.js.map