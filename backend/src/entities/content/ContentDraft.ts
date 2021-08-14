import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Structure, StructureSk } from "../format/Structure";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, DateColumn, EntityId, UpdatedAt } from '../Utils';
import { Content, ContentSk } from "./Content";

/*
write  = データ量が増加するか、同じデータ量でデータが変化すること
remove = データ量が減少すること

                 | remove some field | remove none
write some field | remove            | write
write none       | remove            | null
*/

export enum ContentDraftState {
    EDITING = "editing",
    CANCELED = "canceled",
    COMMITTED = "committed"
}

export type ContentDraftSk = NewTypeInt<"ContentDraftSk">;

export type ContentDraftId = NewTypeString<"ContentDraftId">;

@Entity()
@Unique(["contentId", "user"])
export class ContentDraft {

    @PrimaryGeneratedColumn()
    id: ContentDraftSk;

    @EntityId()
    entityId: ContentDraftId;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    // =========================================
    @Column({ asExpression: "coalesce(contentId, intendedSpaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    // one of content or space is specified
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    @JoinColumn({ name: "contentId" })
    content: Content | null;
    @Column("int", { nullable: true })
    contentId: ContentSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedSpaceId" })
    intendedSpace: Space | null;
    @Column("int", { nullable: true })
    intendedSpaceId: SpaceSk | null;

    // =========================================

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column()
    userId: UserSk;
    /*
        @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
        @JoinColumn({ name: "basedCommitId" })
        basedCommit: ContentCommit | null;
        @Column({ nullable: true })
        basedCommitId: ContentCommitSk | null;
    */
    @Column({
        type: "enum",
        enum: ContentDraftState,
        default: ContentDraftState.EDITING
    })
    state: ContentDraftState;
    /*
        @OneToMany(type => ContentSnapshot, x => x.draft, { onDelete: "RESTRICT" })
        snapshots: ContentSnapshot[];
    */
    @CreatedAt()
    createdAt: Date;

    @DateColumn()
    updatedAtOnlyContent: Date;

    @UpdatedAt()
    updatedAt: Date;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as ContentDraftId;
        }
    }
}