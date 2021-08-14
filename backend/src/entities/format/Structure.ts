import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { CreatedAt, createEntityId, EntityId } from '../Utils';
import { Format, FormatSk } from "./Format";
import { Property } from "./Property";

export type StructureSk = NewTypeInt<"StructureSk">;

export type StructureId = NewTypeString<"StructureId">;

// 所有者: Format
@Entity()
@Unique(["formatId", "version"])
export class Structure {

    @PrimaryGeneratedColumn()
    id: StructureSk;

    @EntityId()
    entityId: StructureId;

    @Column()
    version: number;

    @Column("varchar", { length: 50, nullable: true })
    title: string | null;

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
        if (!this.entityId) {
            this.entityId = createEntityId() as StructureId;
        }
    }
}