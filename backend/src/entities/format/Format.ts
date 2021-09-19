import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createDisplayId, createEntityId, DisplayId, DisplayName, EntityId, UpdatedAt } from '../Utils';
import { Property, PropertySk } from "./Property";
import { Structure, StructureSk } from "./Structure";

export enum FormatUsage {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

export type FormatSk = NewTypeInt<"FormatSk">;

export type FormatId = NewTypeString<"FormatId">;

export type FormatDisplayId = NewTypeString<"FormatDisplayId">;

export type SemanticId = NewTypeString<"SemanticId">;

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

    @OneToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "currentStructureId" })
    currentStructure: Structure;
    @Column({ nullable: true }) // トランザクション外ではnullにならない
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

    @ManyToOne(type => Property, { onDelete: "CASCADE" })
    @JoinColumn({ name: "semanticIdId" })
    semanticId: Property | null;
    @Column("int", { nullable: true })
    semanticIdId: PropertySk | null;

    @Column()
    latestVersion: number;

    @Column("varchar", { nullable: true })
    icon: string | null;

    @BeforeInsert()
    onInsert() {
        if (!this.displayId) {
            this.displayId = createDisplayId() as FormatDisplayId;
        }
        if (!this.entityId) {
            this.entityId = createEntityId() as FormatId;
        }
    }
}
