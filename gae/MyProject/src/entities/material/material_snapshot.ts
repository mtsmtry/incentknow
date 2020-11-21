import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';
import { MaterialDraft, MaterialDraftSk } from "./material_draft";
import { MaterialEditing, MaterialEditingSk } from "./material_editing";

// 制約: 一度作成されると変更されない
// 指針: 永久保存される必要が生じた場合に作成される

export type MaterialSnapshotSk = SurrogateKey<"MaterialSnapshot">;

// Index: material -> ownerUser -> timestamp
@Entity()
export class MaterialSnapshot {

    @PrimaryGeneratedColumn()
    id: MaterialSnapshotSk;

    @EntityId()
    entityId: string;

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

    @Column({ select: false })
    data: string;

    @Column({ asExpression: "char_length(`data`)", generatedType: "STORED" })
    dataSize: number;

    @Column()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}