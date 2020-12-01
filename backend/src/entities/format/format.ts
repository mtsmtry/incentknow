import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { CreatedAt, createDisplayId, createEntityId, DisplayId, DisplayName, EntityId, UpdatedAt } from '../utils';
import { Property } from "./property";
import { Structure, StructureSk } from "./structure";

export enum FormatUsage {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

export type FormatSk = NewTypeInt<"FormatSk">;

export type FormatId = NewTypeString<"FormatId">;

export type FormatDisplayId = NewTypeString<"FormatDisplayId">;

@Entity()
export class Format {

    @PrimaryGeneratedColumn()
    id: FormatSk;

    @EntityId()
    entityId: FormatId;

    @DisplayId()
    displayId: FormatDisplayId;

    @DisplayName()
    displayName: string;

    @ManyToOne(type => Space, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "spaceId" })
    space: Space;
    @Column()
    spaceId: SpaceSk;

    @Column()
    description: string;

    @OneToOne(type => Structure, { onDelete: "SET NULL" })
    @JoinColumn({ name: "currentStructureId" })
    currentStructure: Structure;
    @Column()
    currentStructureId: StructureSk;

    @Column({
        type: "enum",
        enum: FormatUsage
    })
    usage: FormatUsage;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "updaterUserId" })
    updaterUser: User;
    @Column()
    updaterUserId: UserSk;

    @OneToMany(type => Structure, strc => strc.format, { onDelete: "CASCADE" })
    structures: Structure[];

    @OneToMany(type => Property, prop => prop.format, { onDelete: "CASCADE", cascade: ["insert"] })
    properties: Property[];

    @Column()
    semanticId: string | null;

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId() as FormatDisplayId;
        this.entityId = createEntityId() as FormatId;
    }
}
