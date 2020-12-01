import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { Structure, StructureSk } from "../format/structure";
import { User, UserSk } from "../user/user";
import { createEntityId, EntityId, UpdatedAt } from '../utils';
import { Content, ContentSk } from "./content";
import { ContentEditing, ContentEditingSk } from "./content_editing";

export type ContentCommitSk = NewTypeInt<"ContentCommitSk">;

export type ContentCommitId = NewTypeString<"ContentCommitId">;

@Entity()
export class ContentCommit {

    @PrimaryGeneratedColumn()
    id: ContentCommitSk;

    @EntityId()
    entityId: ContentCommitId;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @JoinColumn({ name: "contentId" })
    content: Content;
    @Column()
    contentId: ContentSk;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @OneToOne(type => ContentEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "editingId" })
    editing: ContentEditing;
    @Column()
    editingId: ContentEditingSk;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "basedCommitId" })
    basedCommit: ContentCommit | null;
    @Column({ nullable: true })
    basedCommitId: ContentCommitSk | null;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "committerUserId" })
    committerUser: User;
    @Column()
    committerUserId: UserSk;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as ContentCommitId;
    }
}