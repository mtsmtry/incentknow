import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { CreatedAt, createEntityId, DisplayName, UpdatedAt } from '../Utils';
import { Format, FormatSk } from "./Format";
import { MetaProperty } from "./MetaProperty";

export enum TypeName {
    INT = "integer",
    BOOL = "boolean",
    STRING = "string",
    CONTENT = "content",
    URL = "url",
    OBJECT = "object",
    TEXT = "text",
    ARRAY = "array",
    ENUM = "enumerator",
    DOCUMENT = "document",
    IMAGE = "image",
    ENTITY = "entity"
}

export function isMaterialType(type: TypeName) {
    return type == TypeName.DOCUMENT || type == TypeName.TEXT;
}

export enum Language {
    PYTHON = "python",
    JAVASCRIPT = "javascript"
}

export type PropertySk = NewTypeInt<"PropertySk">;

export type PropertyId = NewTypeString<"PropertyId">;

// 所有者: Format
@Entity()
@Unique(["format", "parentProperty", "order"])
@Unique(["format", "entityId"])
export class Property {

    @PrimaryGeneratedColumn()
    id: PropertySk;

    @Column("char", { length: 2 })
    entityId: PropertyId;

    // Format削除時にすべてのPropertyは削除される
    @ManyToOne(type => Format, format => format.properties, { onDelete: "CASCADE" })
    @JoinColumn({ name: "formatId" })
    format: Format;
    @Column()
    formatId: FormatSk;

    @ManyToOne(type => Property, prop => prop.argProperties, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "parentPropertyId" })
    parentProperty: Property | null;
    @Column("int", { nullable: true })
    parentPropertyId: PropertySk | null;

    @DisplayName()
    displayName: string;

    @Column("varchar", { length: 100, nullable: true })
    fieldName: string | null;

    @Column("varchar", { length: 100, nullable: true })
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
    @JoinColumn({ name: "argFormatId" })
    argFormat: Format | null;
    @Column("int", { nullable: true })
    argFormatId: FormatSk | null;

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

    @OneToMany(type => MetaProperty, meta => meta.property, { onDelete: "CASCADE", cascade: ["insert"] })
    metaProperties: MetaProperty[];

    @Column("varchar", { nullable: true })
    icon: string | null;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId(2) as PropertyId;
        }
    }
}