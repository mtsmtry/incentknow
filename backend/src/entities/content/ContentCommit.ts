import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Structure, StructureSk } from "../format/Structure";
import { User, UserSk } from "../user/User";
import { createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Content, ContentSk } from "./Content";
import { ContentEditing, ContentEditingSk } from "./ContentEditing";

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
    editing: ContentEditing | null;
    @Column("int", { nullable: true })
    editingId: ContentEditingSk | null;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "basedCommitId" })
    basedCommit: ContentCommit | null;
    @Column("int", { nullable: true })
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