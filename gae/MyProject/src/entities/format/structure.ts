import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Space } from "../space/space";
import { User } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';
import { Format, FormatSk } from "./format";
import { Property } from "./property";

export type StructureSk = SurrogateKey<"Structure">;

// 所有者: Format
@Entity()
export class Structure {

    @PrimaryGeneratedColumn()
    id: StructureSk;

    @EntityId()
    entityId: string;

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
        this.entityId = createEntityId();
    }
}