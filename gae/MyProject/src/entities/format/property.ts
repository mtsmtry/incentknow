import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Space } from "../space/space";
import { User } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';
import { Format, FormatSk } from "./format";

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
    CODE = "code",
    ENUM = "enumerator",
    DOCUMENT = "document",
    IMAGE = "image",
    ENTITY = "entity"
}

export enum Language {
    PYTHON = "python",
    JAVASCRIPT = "javascript"
}

export type PropertySk = SurrogateKey<"Property">;

// 所有者: Format
@Entity()
@Unique(["format", "parentProperty", "order"])
@Unique(["format", "entityId"])
export class Property {

    @PrimaryGeneratedColumn()
    id: PropertySk;

    @Column("char", { length: 2 })
    entityId: string;

    // Format削除時にすべてのPropertyは削除される
    @ManyToOne(type => Format, format => format.properties, { onDelete: "CASCADE" })
    @JoinColumn({ name: "formatId" })
    format: Format;
    @Column()
    formatId: FormatSk;

    @ManyToOne(type => Property, prop => prop.argProperties, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "parentPropertyId" })
    parentProperty: Property | null;
    @Column({ nullable: true })
    parentPropertyId: PropertySk | null;

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

    @ManyToOne(type => Format, { onDelete: "RESTRICT" })
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