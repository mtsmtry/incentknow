import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Structure, StructureSk } from "../format/Structure";
import { createEntityId, EntityId, UpdatedAt } from '../Utils';

export type ContentTransitionSk = NewTypeInt<"ContentTransitionSk">;

export type ContentTransitionId = NewTypeString<"ContentTransitionId">;

@Entity()
export class ContentTransition {

    @PrimaryGeneratedColumn()
    id: ContentTransitionSk;

    @EntityId()
    entityId: ContentTransitionId;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @UpdatedAt()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as ContentTransitionId;
    }
}