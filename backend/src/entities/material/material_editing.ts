import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { ContentEditing, ContentEditingSk } from "../content/content_editing";
import { User, UserSk } from "../user/user";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../utils';
import { MaterialCommit, MaterialCommitSk } from "./material_commit";
import { MaterialDraft, MaterialDraftSk } from "./material_draft";
import { MaterialSnapshot } from "./material_snapshot";

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

    @OneToOne(type => ContentEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "parentEditingId" })
    parentEditing: ContentEditing | null;
    @Column({ nullable: true })
    parentEditingId: ContentEditingSk | null;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column()
    userId: UserSk;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "forkedCommitId" })
    forkedCommit: MaterialCommit | null;
    @Column({ nullable: true })
    forkedCommitId: MaterialCommitSk | null;

    @Column({
        type: "enum",
        enum: MaterialEditingState,
        default: MaterialEditingState.EDITING
    })
    state: MaterialEditingState;

    @OneToMany(type => MaterialSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: MaterialSnapshot[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as MaterialEditingId;
    }
}
