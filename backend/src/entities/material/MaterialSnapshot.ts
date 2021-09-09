import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Document } from "../../interfaces/material/Material";
import { createEntityId, EntityId, UpdatedAt } from '../Utils';
import { MaterialEditing, MaterialEditingSk } from "./MaterialEditing";

export type MaterialSnapshotSk = NewTypeInt<"MaterialSnapshotSk">;

export type MaterialSnapshotId = NewTypeString<"MaterialSnapshotId">;

// Index: material -> ownerUser -> timestamp

@Entity()
export class MaterialSnapshot {

    @PrimaryGeneratedColumn()
    id: MaterialSnapshotSk;

    @EntityId()
    entityId: MaterialSnapshotId;

    @ManyToOne(type => MaterialEditing, { onDelete: "CASCADE" })
    @JoinColumn({ name: "editingId" })
    editing: MaterialEditing;
    @Column()
    editingId: MaterialEditingSk;

    @Column({ type: "text", select: false })
    data: string;

    @Column()
    textCount: number;

    @Column({ type: "varchar", length: 140 })
    beginning: string;

    @UpdatedAt()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as MaterialSnapshotId;
        }
    }
}