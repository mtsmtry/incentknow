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

    @ManyToOne(type => MaterialEditing, { onDelete: "RESTRICT" })
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

    @BeforeInsert()
    @BeforeUpdate()
    onUpdate() {
        if (this.data) {
            const doc: Document = JSON.parse(this.data);
            let text = "";
            doc.blocks.forEach(block => {
                if (block.data.text) {
                    text += block.data.text + " ";
                }
            });
            this.beginning = text.substring(0, 140);
            this.textCount = text.length;
        }
    }
}