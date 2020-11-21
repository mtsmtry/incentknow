import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Structure } from "../format/structure";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';
import { Content } from "./content";
import { Space } from "../space/space";
import { ContentDraft, ContentDraftSk } from "./content_draft";
import { ContentCommit, ContentCommitSk } from "./content_commit";
import { ContentSnapshot } from "./content_snapshot";

export enum ContentEditingState {
    EDITING = "editing",
    COMMITTED = "committed",
    CANCELD = "canceled"
}

export type ContentEditingSk = SurrogateKey<"ContentEditing">;

@Entity()
export class ContentEditing {

    @PrimaryGeneratedColumn()
    id: ContentEditingSk;

    @EntityId()
    entityId: string;

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
