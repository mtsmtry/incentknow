import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { CreatedAt, createEntityId, EntityId } from '../utils';
import { Format, FormatSk } from "./format";
import { Property } from "./property";

export type StructureSk = NewTypeInt<"StructureSk">;

export type StructureId = NewTypeString<"StructureId">;

// 所有者: Format
@Entity()
export class Structure {

    @PrimaryGeneratedColumn()
    id: StructureSk;

    @EntityId()
    entityId: StructureId;

    // Format削除時にすべてのStructureは削除される
    @ManyToOne(type => Format, format => format.structures, { onDelete: "CASCADE" })
    @JoinColumn({ name: "formatId" })
    format: Format;
    @Column()
    formatId: FormatSk;

    @ManyToMany(type => Property, { onDelete: "CASCADE", cascade: true })
    @JoinTable()
    properties: Property[];

    @CreatedAt()
    createdAt: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as StructureId;
    }
}