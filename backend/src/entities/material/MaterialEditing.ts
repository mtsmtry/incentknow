import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { MaterialCommit, MaterialCommitSk } from "./MaterialCommit";
import { MaterialDraft, MaterialDraftSk } from "./MaterialDraft";
import { MaterialSnapshot, MaterialSnapshotSk } from "./MaterialSnapshot";

export enum MaterialEditingState {
    EDITING = "editing",
    COMMITTED = "committed",
    CANCELD = "canceled"
}

export type MaterialEditingSk = NewTypeInt<"MaterialEditingSk">;

export type MaterialEditingId = NewTypeString<"MaterialEditingId">;

@Entity()
export class MaterialEditing {

    @PrimaryGeneratedColumn()
    id: MaterialEditingSk;

    @EntityId()
    entityId: MaterialEditingId;

    @ManyToOne(type => MaterialDraft, { onDelete: "CASCADE" })
    @JoinColumn({ name: "draftId" })
    draft: MaterialDraft;
    @Column()
    draftId: MaterialDraftSk;

    @OneToOne(type => MaterialSnapshot, { onDelete: "SET NULL" })
    @JoinColumn({ name: "snapshotId" })
    snapshot: MaterialSnapshot;
    @Column({ nullable: true }) // トランザクション外ではnullにならない
    snapshotId: MaterialSnapshotSk;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "basedCommitId" })
    basedCommit: MaterialCommit | null;
    @Column("int", { nullable: true })
    basedCommitId: MaterialCommitSk | null;

    @Column({
        type: "enum",
        enum: MaterialEditingState,
        default: MaterialEditingState.EDITING
    })
    state: MaterialEditingState;

    @OneToMany(type => MaterialSnapshot, x => x.editing, { onDelete: "RESTRICT" })
    snapshots: MaterialSnapshot[];

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as MaterialEditingId;
        }
    }
}
