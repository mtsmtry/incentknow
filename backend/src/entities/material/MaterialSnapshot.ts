import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { createEntityId, EntityId } from '../Utils';
import { MaterialDraft, MaterialDraftSk } from "./MaterialDraft";
import { MaterialEditing, MaterialEditingSk } from "./MaterialEditing";

// 制約: 一度作成されると変更されない
// 指針: 永久保存される必要が生じた場合に作成される

export type MaterialSnapshotSk = NewTypeInt<"MaterialSnapshotSk">;

export type MaterialSnapshotId = NewTypeString<"MaterialSnapshotId">;

// Index: material -> ownerUser -> timestamp
@Entity()
export class MaterialSnapshot {

    @PrimaryGeneratedColumn()
    id: MaterialSnapshotSk;

    @EntityId()
    entityId: MaterialSnapshotId;

    @ManyToOne(type => MaterialDraft, { onDelete: "CASCADE" })
    @JoinColumn({ name: "draftId" })
    draft: MaterialDraft;
    @Column()
    draftId: MaterialDraftSk;

    @ManyToOne(type => MaterialEditing, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "editingId" })
    editing: MaterialEditing;
    @Column()
    editingId: MaterialEditingSk;

    @Column({ type: "text", select: false })
    data: string;

    @Column({ asExpression: "char_length(`data`)", generatedType: "STORED" })
    dataSize: number;

    @Column()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as MaterialSnapshotId;
    }
}