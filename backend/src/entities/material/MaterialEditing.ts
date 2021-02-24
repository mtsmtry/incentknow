import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { ContentEditing, ContentEditingSk } from "../content/ContentEditing";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { MaterialCommit, MaterialCommitSk } from "./MaterialCommit";
import { MaterialDraft, MaterialDraftSk } from "./MaterialDraft";
import { MaterialSnapshot } from "./MaterialSnapshot";

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
    @Column("int", { nullable: true })
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

    @OneToMany(type => MaterialSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: MaterialSnapshot[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as MaterialEditingId;
    }
}
