import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';
import { Property } from "./property";
import { Structure, StructureSk } from "./structure";

export enum FormatUsage {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

export type FormatSk = SurrogateKey<"Format">;

@Entity()
export class Format {

    @PrimaryGeneratedColumn()
    id: FormatSk;

    @EntityId()
    entityId: string;

    @DisplayId()
    displayId: string;

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
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    }
}
