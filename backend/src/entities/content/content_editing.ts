import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { User, UserSk } from "../user/user";
import { CreatedAt, EntityId, UpdatedAt } from '../utils';
import { ContentCommit, ContentCommitSk } from "./content_commit";
import { ContentDraft, ContentDraftSk } from "./content_draft";
import { ContentSnapshot } from "./content_snapshot";

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
    @JoinColumn({ name: "forkedCommitId" })
    forkedCommit: ContentCommit | null;
    @Column({ nullable: true })
    forkedCommitId: ContentCommitSk | null;

    @OneToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "commitId" })
    commit: ContentEditing | null;
    @Column({ nullable: true })
    commitId: ContentEditingSk | null;

    @Column({
        type: "enum",
        enum: ContentEditingState,
        default: ContentEditingState.EDITING
    })
    state: ContentEditingState;

    @OneToMany(type => ContentSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: ContentSnapshot[];
}
