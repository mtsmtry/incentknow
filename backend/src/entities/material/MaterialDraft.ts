import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content } from "../content/Content";
import { ContentDraft, ContentDraftSk } from "../content/ContentDraft";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Material, MaterialSk } from "./Material";
import { MaterialEditing, MaterialEditingSk } from "./MaterialEditing";

export enum MaterialChangeType {
    INITIAL = "initial",
    WRITE = "write",
    REMOVE = "remove"
}

export type MaterialDraftSk = NewTypeInt<"MaterialDraftSk">;

export type MaterialDraftId = NewTypeString<"MaterialDraftId">;

@Entity()
@Unique(["materialId", "user"])
export class MaterialDraft {

    @PrimaryGeneratedColumn()
    id: MaterialDraftSk;

    @EntityId()
    entityId: MaterialDraftId;

    // not null when editing
    @OneToOne(type => MaterialEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "currentEditingId" })
    currentEditing: MaterialEditing | null;
    @Column("int", { nullable: true })
    currentEditingId: MaterialEditingSk | null;

    //@Column("enum", { enum: MaterialType })
    //intendedMaterialType: MaterialType;

    // one of content or space is specified and material is priority and content is secondary
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    @JoinColumn({ name: "materialId" })
    material: Material | null;
    @Column("int", { nullable: true })
    materialId: MaterialSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedContentDraftId" })
    intendedContentDraft: ContentDraft | null;
    @Column("int", { nullable: true })
    intendedContentDraftId: ContentDraftSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedSpaceId" })
    intendedSpace: Space | null;
    @Column("int", { nullable: true })
    intendedSpaceId: SpaceSk | null;

    //@Column({ asExpression: "coalesce(materialId, intendedContentDraftId, intendedSpaceId)", generatedType: "VIRTUAL" })
    //not_null_constrain: number;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column()
    userId: UserSk;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;
    /*
        @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
        @JoinColumn({ name: "basedCommitId" })
        basedCommit: MaterialCommit | null;
        @Column({ nullable: true })
        basedCommitId: MaterialCommitSk | null;
    */
    @Column({
        type: "enum",
        enum: MaterialChangeType,
        default: MaterialChangeType.INITIAL
    })
    changeType: MaterialChangeType;

    // null when committed
    @Column("text", { select: false, nullable: true })
    data: string | null;

    @Column({ type: "varchar", length: 140, nullable: true, asExpression: "left(data, 140)", generatedType: "STORED" })
    beginning: string | null;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as MaterialDraftId;
    }
}