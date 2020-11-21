import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content, ContentSk } from "./content";
import { ContentCommit, ContentCommitSk } from "./content_commit";
import { ContentEditing, ContentEditingSk } from "./content_editing";
import { ContentSnapshot } from "./content_snapshot";
import { Structure, StructureSk } from "../format/structure";
import { Space } from "../space/space";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

/*
write  = データ量が増加するか、同じデータ量でデータが変化すること
remove = データ量が減少すること

                 | remove some field | remove none
write some field | remove            | write
write none       | remove            | null
*/

export enum ContentChangeType {
    INITIAL = "initial",
    WRITE = "write",
    REMOVE = "remove"
}

export type ContentDraftSk = SurrogateKey<"ContentDraft">;

@Entity()
@Unique(["unique_by_user_constrain", "user"])
export class ContentDraft {

    @PrimaryGeneratedColumn()
    id: ContentDraftSk;

    @EntityId()
    entityId: string;

    // not null when editing
    @OneToOne(type => ContentEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "currentEditingId" })
    currentEditing: ContentEditing | null;
    @Column({ nullable: true })
    currentEditingId: ContentEditingSk | null;

    // =========================================
    @Column({ asExpression: "coalesce(contentId, intendedSpaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    // one of content or space is specified
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    @JoinColumn({ name: "contentId" })
    content: Content | null;
    @Column({ nullable: true })
    contentId: ContentSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    intendedSpace: Space | null;

    // =========================================

    @Column({ asExpression: "coalesce(contentId, -createdAt)", generatedType: "VIRTUAL" })
    unique_by_user_constrain: number;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column()
    userId: UserSk;

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "forkedCommitId" })
    forkedCommit: ContentCommit | null;
    @Column({ nullable: true })
    forkedCommitId: ContentCommitSk | null;

    @Column({
        type: "enum",
        enum: ContentChangeType,
        default: ContentChangeType.INITIAL
    })
    changeType: ContentChangeType;

    // null when committed
    @Column("simple-json", { select: false, nullable: true })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @OneToMany(type => ContentSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: ContentSnapshot[];

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}