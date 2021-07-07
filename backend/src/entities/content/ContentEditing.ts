import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { ContentCommit, ContentCommitSk } from "./ContentCommit";
import { ContentDraft, ContentDraftSk } from "./ContentDraft";
import { ContentSnapshot } from "./ContentSnapshot";

export enum ContentEditingState {
    EDITING = "editing",
    COMMITTED = "committed",
    CANCELD = "canceled"
}

export type ContentEditingSk = NewTypeInt<"ContentEditingSk">;

export type ContentEditingId = NewTypeString<"ContentEditingId">;

@Entity()
export class ContentEditing {

    @PrimaryGeneratedColumn()
    id: ContentEditingSk;

    @EntityId()
    entityId: ContentEditingId;

    @ManyToOne(type => ContentDraft, { onDelete: "CASCADE" })
    @JoinColumn({ name: "draftId" })
    draft: ContentDraft;
    @Column()
    draftId: ContentDraftSk;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column()
    userId: UserSk;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "basedCommitId" })
    basedCommit: ContentCommit | null;
    @Column("int", { nullable: true })
    basedCommitId: ContentCommitSk | null;
    /*
        @OneToOne(type => ContentCommit, { onDelete: "SET NULL" })
        @JoinColumn({ name: "commitId" })
        commit: ContentEditing | null;
        @Column({ nullable: true })
        commitId: ContentEditingSk | null;
    */
    @Column({
        type: "enum",
        enum: ContentEditingState,
        default: ContentEditingState.EDITING
    })
    state: ContentEditingState;

    @OneToMany(type => ContentSnapshot, x => x.editing, { onDelete: "RESTRICT" })
    snapshots: ContentSnapshot[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as ContentEditingId;
    }
}
