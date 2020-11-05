import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

function DisplayId() {
    return Column("varchar", { length: 15, unique: true });
}

function EntityId(length = 12) {
    return Column("char", { length, unique: true })
}

function DisplayName() {
    return Column("varchar", { length: 50 });
}

function createEntityId() {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 12;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('');
}

function createDisplayId() {
    const S = "0123456789";
    const N = 15;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('');
}

function CreatedAt() {
    return CreateDateColumn({ precision: 0, default: () => 'NOW()' })
} 

function UpdatedAt() {
    return UpdateDateColumn({ precision: 0, default: () => 'NOW()' })
} 

/*

id: RDBのJoin用に用いられる, サーバー外では使用しない
displayId: ユーザーが設定する
entityId: mongoDbの保存に用いられる 

new関数: DBの制約上insert時に必要十分な値

*/

@Entity()
export class User extends BaseEntity {

    static new(email: string, displayName: string, password: string) {
        return User.create({
            email,
            displayName,
            passwordHash: bcrypt.hashSync(password, 10)
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @DisplayId()
    displayId: string;

    @DisplayName()
    displayName: string;

    @Column("char", { length: 60, select: false })
    passwordHash: string;

    @Column("varchar", { length: 255, unique: true, select: false })
    email: string;

    @Column({ nullable: true })
    iconUrl: string | null;

    @CreatedAt()
    createdAt: Date;

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    }
}

export enum MembershipMethod {
    NONE = "none",
    APP = "app"
}

export enum SpaceAuth {
    NONE = "none",
    VISIBLE = "visible",
    READABLE = "readable",
    WRITABLE = "writable"
}

@Entity()
export class Space extends BaseEntity {

    static new(creatorUserId: number, displayName: string, description: string) {
        return Space.create({
            displayName,
            description,
            creatorUser: User.create({ id: creatorUserId })
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @DisplayId()
    displayId: string;

    @DisplayName()
    displayName: string;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "SET NULL" })
    creatorUser: User;

    @Column()
    description: string;

    @Column({ nullable: true })
    homeUrl: string | null;

    @Column({
        type: "enum",
        enum: MembershipMethod,
        default: MembershipMethod.NONE
    })
    membershipMethod: MembershipMethod;

    @Column({ default: false })
    published: boolean;

    @Column({
        type: "enum",
        enum: SpaceAuth,
        default: SpaceAuth.NONE
    })
    defaultAuthority: SpaceAuth;

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    }
}

@Entity()
export class Crawler extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @OneToOne(type => Content, { onDelete: "SET NULL" })
    definition: Content;

    @DisplayName()
    displayName: string;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    updaterUser: User;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

export enum ReactorState {
    INVAILD = "invaild"
}

@Entity()
export class Reactor extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;

    @ManyToOne(type => Format, { onDelete: "CASCADE", nullable: false })
    format: Format;

    @Column({
        type: "enum",
        enum: ReactorState,
        default: ReactorState.INVAILD
    })
    state: ReactorState;

    @OneToOne(type => Content, { onDelete: "SET NULL", nullable: true })
    definition: Content | null;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    creatorUser: User;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

export enum MemberType {
    NORMAL = "normal",
    OWNER = "owner"
}

@Entity()
@Unique(["space", "user"])
export class SpaceMember extends BaseEntity {

    static new(spaceId: number, userId: number, type: MemberType) {
        return SpaceMember.create({
            type,
            space: Space.create({ id: spaceId }),
            user: User.create({ id: userId })
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;
    @RelationId((member: SpaceMember) => member.space)
    spaceId: number;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;
    @RelationId((member: SpaceMember) => member.user)
    userId: number;

    @CreatedAt()
    joinedAt: Date;

    @Column({
        type: "enum",
        enum: MemberType
    })
    type: MemberType;
}

@Entity()
export class SpaceFollow extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;

    @CreatedAt()
    followedAt: Date;
}

@Entity()
@Unique(["space", "user"])
export class SpaceMembershipApplication extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;

    @CreatedAt()
    appliedAt: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
@Unique(["space", "format"])
export class Container extends BaseEntity {

    static new(spaceId: number, formatId: number) {
        return Container.create({
            space: Space.create({ id: spaceId }),
            format: Format.create({ id: formatId })
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => Space, { onDelete: "RESTRICT", nullable: false })
    space: Space;

    @ManyToOne(type => Format, { onDelete: "RESTRICT", nullable: false })
    format: Format;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

export enum FormatUsage {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

export enum ContentGenerator {
    REACTOR = "reactor",
    CRAWLER = "crawler"
}

@Entity()
export class Format extends BaseEntity {

    static new(creatorUserId: number, spaceId: number, displayName: string, description: string, usage: FormatUsage) {
        return Format.create({
            displayName,
            description,
            usage,
            space: Space.create({ id: spaceId }),
            creatorUser: User.create({ id: creatorUserId }),
            updaterUser: User.create({ id: creatorUserId })
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @DisplayId()
    displayId: string;

    @DisplayName()
    displayName: string;

    @ManyToOne(type => Space, { onDelete: "RESTRICT", nullable: false })
    @JoinColumn()
    space: Space;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: ContentGenerator,
        nullable: true
    })
    generator: ContentGenerator | null;

    @OneToOne(type => Structure, { onDelete: "SET NULL" })
    @JoinColumn()
    currentStructure: Structure;

    @Column({
        type: "enum",
        enum: FormatUsage
    })
    usage: FormatUsage;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    creatorUser: User;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    updaterUser: User;

    @OneToMany(type => Structure, strc => strc.format, { onDelete: "CASCADE" })
    structures: Structure[];

    @OneToMany(type => Property, prop => prop.format, { onDelete: "CASCADE", cascade: ["insert"] })
    properties: Property[];

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    }
}

export enum TypeName {
    INT = "integer",
    BOOL = "boolean",
    STRING = "string",
    FORMAT = "format",
    SPACE = "space",
    CONTENT = "content",
    URL = "url",
    OBJECT = "object",
    TEXT = "text",
    ARRAY = "array",
    CODE = "code"
}

export enum Language {
    PYTHON = "python",
    JAVASCRIPT = "javascript"
}

// 所有者: Format
@Entity()
@Unique(["format", "parentProperty", "order"])
@Unique(["format", "entityId"])
export class Property extends BaseEntity {

    static new(formatId: number, parentPropertyId: number | null, entityId: string, displayName: string, typeName: TypeName, order: number) {
        return Property.create({
            order,
            displayName,
            entityId,
            typeName,
            parentProperty: parentPropertyId ? Property.create({ id: parentPropertyId }) : null,
            format: Format.create({ id: formatId })
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column("char", { length: 2 })
    entityId: string;

    // Format削除時にすべてのPropertyは削除される
    @ManyToOne(type => Format, format => format.properties, { onDelete: "CASCADE", nullable: false })
    format: Format;

    @ManyToOne(type => Property, prop => prop.argProperties, { onDelete: "RESTRICT" })
    parentProperty: Property | null;

    @DisplayName()
    displayName: string;

    @Column({ nullable: true })
    fieldName: string | null;

    @Column({ nullable: true })
    semantic: string | null;

    @Column({ default: false })
    optional: boolean;

    @Column()
    order: number;

    @Column({
        type: "enum",
        enum: TypeName
    })
    typeName: TypeName;

    @ManyToOne(type => Container, { onDelete: "RESTRICT" })
    argFormat: Format | null;

    @Column({
        type: "enum",
        enum: TypeName,
        nullable: true
    })
    argType: TypeName | null;

    @Column({
        type: "enum",
        enum: Language,
        nullable: true
    })
    argLanguage: Language | null;

    @OneToMany(type => Property, prop => prop.parentProperty)
    @JoinTable()
    argProperties: Property[];

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;
}

// 所有者: Format
@Entity()
export class Structure extends BaseEntity {

    static new(formatId: number, properties: Property[]) {
        return Structure.create({
            properties,
            format: Format.create({ id: formatId })
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    // Format削除時にすべてのStructureは削除される
    @ManyToOne(type => Format, format => format.structures, { onDelete: "CASCADE", nullable: false })
    format: Format;
    @RelationId((strc: Structure) => strc.format)
    formatId: number;

    @ManyToMany(type => Property, { onDelete: "CASCADE", cascade: true })
    @JoinTable()
    properties: Property[];

    @CreatedAt()
    createdAt: Date;
    
    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
export class Content extends BaseEntity {

    static new(containerId: number, structureId: number, creatorUserId: number) {
        return Content.create({
            container: Container.create({ id: containerId }),
            structure: Container.create({ id: containerId }),
            creatorUser: User.create({ id: containerId }),
            updaterUser: User.create({ id: containerId }),
        });
    }

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Container, { onDelete: "RESTRICT", nullable: false })
    container: Container;
    @RelationId((content: Content) => content.container)
    containerId: number;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT", nullable: false })
    structure: Structure;
    @RelationId((content: Content) => content.structure)
    structureId: number;

    @OneToMany(type => Material, mat => mat.content)
    materials: Material[];

    @CreatedAt()
    createdAt: Date;
    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    creatorUser: User;

    // 帰属するMaterialの更新も含む
    @UpdatedAt()
    updatedAt: Date;
    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    updaterUser: User;

    @Column({ default: 1 })
    updateCount: number;

    @Column({ default: 0 })
    viewCount: number;

    @OneToMany(type => ContentCommit, strc => strc.content, { onDelete: "RESTRICT" })
    commits: ContentCommit[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
export class ContentCommit extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @OneToOne(type => ContentEditing, { onDelete: "RESTRICT" })
    editing: ContentEditing;
    @RelationId((x: ContentCommit) => x.editing)
    editingId: number;

    @ManyToOne(type => Content, { onDelete: "CASCADE", nullable: false })
    content: Content;
    @RelationId((x: ContentCommit) => x.content)
    contentId: number;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT", nullable: false })
    structure: Structure;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    forkedCommit: ContentCommit | null;

    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    committerUser: User;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

export enum EditingState {
    EDITING = "editing",
    COMMITTED = "committed",
    CANCELD = "canceled"
}

export enum DraftState {
    EDITING = "editing",
}

/*
write  = データ量が増加するか、同じデータ量でデータが変化すること
remove = データ量が減少すること

                 | remove some field | remove none
write some field | remove            | write
write none       | remove            | null
*/

export enum ChangeType {
    INITIAL = "initial",
    WRITE = "write",
    REMOVE = "remove"
}

@Entity()
@Unique(["unique_by_user_constrain", "user"])
export class ContentDraft extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    // not null when editing
    @OneToOne(type => ContentEditing, { onDelete: "SET NULL" })
    currentEditing: ContentEditing | null;    
    @RelationId((x: ContentDraft) => x.currentEditing)
    currentEditingId: number | null;

    // one of content or space is specified
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    content: Content | null;
    @RelationId((x: ContentDraft) => x.content)
    contentId: number | null;
    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    intendedSpace: Space | null;
    @Column({ asExpression: "coalesce(contentId, intendedSpaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    @Column({ asExpression: "coalesce(contentId, -createdAt)", generatedType: "VIRTUAL" })
    unique_by_user_constrain: number;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    forkedCommit: ContentCommit | null;

    @Column({
        type: "enum",
        enum: ChangeType,
        default: ChangeType.INITIAL
    })
    changeType: ChangeType;

    // null when committed
    @Column("simple-json", { select: false, nullable: true })
    data: any;
    @ManyToOne(type => Structure, { onDelete: "RESTRICT", nullable: false })
    structure: Structure;

    @Column({
        type: "enum",
        enum: EditingState,
        default: EditingState.EDITING
    })
    state: EditingState;

    @OneToMany(type => ContentSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: ContentSnapshot[];

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
export class ContentEditing extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => ContentDraft, { onDelete: "CASCADE", nullable: false })
    draft: ContentDraft;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    forkedCommit: ContentCommit | null;

    @Column({
        type: "enum",
        enum: EditingState,
        default: EditingState.EDITING
    })
    state: EditingState;

    @OneToMany(type => MaterialSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: ContentSnapshot[];
}

@Entity()
export class ContentSnapshot extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => ContentDraft, { onDelete: "CASCADE", nullable: false })
    draft: ContentDraft;

    @ManyToOne(type => ContentEditing, { onDelete: "RESTRICT", nullable: false })
    editing: ContentEditing;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT", nullable: false })
    structure: Structure;

    @UpdatedAt()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

export enum MaterialType {
    FOLDER = "folder",
    DOCUMENT = "document"
}

@Entity()
export class Material extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => Content, { onDelete: "RESTRICT" })
    content: Content | null;
    @ManyToOne(type => Space, { onDelete: "RESTRICT" })
    space: Space | null;
    @Column({ asExpression: "coalesce(contentId, spaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    @Column()
    displayName: string;
    
    @Column({
        type: "enum",
        enum: MaterialType
    })
    materialType: MaterialType;

    @Column({ select: false })
    data: string;

    @CreatedAt()
    createdAt: Date;
    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    creatorUser: User;

    @UpdatedAt()
    updatedAt: Date;
    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    updaterUser: User;

    @OneToMany(type => MaterialCommit, strc => strc.material, { onDelete: "RESTRICT" })
    commits: MaterialCommit[];

    @OneToMany(type => MaterialDraft, x => x.material, { onDelete: "RESTRICT" })
    drafts: MaterialDraft[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
export class MaterialCommit extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => Content, { onDelete: "CASCADE", nullable: false })
    @Index()
    material: Material;
    @RelationId((x: MaterialCommit) => x.material)
    materialId: number;

    @OneToOne(type => MaterialEditing, { onDelete: "RESTRICT" })
    editing: MaterialEditing;
    @RelationId((x: MaterialCommit) => x.editing)
    editingId: number;

    @OneToOne(type => ContentCommit, { onDelete: "SET NULL" })
    parentCommit: ContentCommit | null;
    @RelationId((x: MaterialCommit) => x.parentCommit)
    parentCommitId: number | null;

    @Column({ select: false })
    data: string;

    @Column({ asExpression: "char_length(`data`)", generatedType: "STORED" })
    dataSize: number;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    forkedCommit: MaterialCommit | null;

    @ManyToOne(type => User, { onDelete: "RESTRICT", nullable: false })
    committerUser: User;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
@Unique(["unique_by_user_constrain", "user"])
export class MaterialDraft extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    // not null when editing
    @OneToOne(type => MaterialEditing, { onDelete: "SET NULL" })
    currentEditing: MaterialEditing | null;    
    @RelationId((x: MaterialDraft) => x.currentEditing)
    currentEditingId: number | null;

    @Column({
        type: "enum",
        enum: MaterialType,
        nullable: true
    })
    intendedMaterialType: MaterialType | null;
    @Column({ nullable: true })
    intendedDisplayName: string | null;

    // one of content or space is specified and material is priority and content is secondary
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    material: Material | null;
    @RelationId((x: MaterialDraft) => x.material)
    materialId: number | null;
    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    intendedContentDraft: ContentDraft | null;
    @RelationId((x: MaterialDraft) => x.intendedContentDraft)
    intendedContentDraftId: number | null;
    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    intendedSpace: Space | null;
    @Column({ asExpression: "coalesce(materialId, intendedContentDraftId, intendedSpaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    @Column({ asExpression: "coalesce(materialId, -createdAt)", generatedType: "VIRTUAL" })
    unique_by_user_constrain: number;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    forkedCommit: MaterialCommit | null;

    @Column({
        type: "enum",
        enum: ChangeType,
        default: ChangeType.INITIAL
    })
    changeType: ChangeType;

    // null when committed
    @Column({ select: false, nullable: true })
    data: string | null;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}

@Entity()
export class MaterialEditing extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => MaterialDraft, { onDelete: "CASCADE", nullable: false })
    draft: MaterialDraft;

    @OneToOne(type => ContentEditing, { onDelete: "SET NULL" })
    parentEditing: ContentEditing | null;
    @RelationId((x: MaterialEditing) => x.parentEditing)
    parentEditingId: number | null;

    @ManyToOne(type => User, { onDelete: "CASCADE", nullable: false })
    user: User;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    forkedCommit: MaterialCommit | null;

    @Column({
        type: "enum",
        enum: EditingState,
        default: EditingState.EDITING
    })
    state: EditingState;

    @OneToMany(type => MaterialSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: MaterialSnapshot[];
}

// 制約: 一度作成されると変更されない
// 指針: 永久保存される必要が生じた場合に作成される
// Index: material -> ownerUser -> timestamp
@Entity()
export class MaterialSnapshot extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => MaterialDraft, { onDelete: "CASCADE", nullable: false })
    draft: MaterialDraft;

    @ManyToOne(type => MaterialEditing, { onDelete: "RESTRICT", nullable: false })
    editing: MaterialEditing;

    @Column({ select: false })
    data: string;

    @Column({ asExpression: "char_length(`data`)", generatedType: "STORED" })
    dataSize: number;

    @Column()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}