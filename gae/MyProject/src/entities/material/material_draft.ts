import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content } from "../content/content";
import { ContentDraft, ContentDraftSk } from "../content/content_draft";
import { Material, MaterialSk, MaterialType } from "./material";
import { MaterialCommit, MaterialCommitSk } from "./material_commit";
import { MaterialEditing } from "./material_editing";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export enum MaterialChangeType {
    INITIAL = "initial",
    WRITE = "write",
    REMOVE = "remove"
}

export type MaterialDraftSk = SurrogateKey<"MaterialDraft">;

@Entity()
@Unique(["unique_by_user_constrain", "user"])
export class MaterialDraft {

    @PrimaryGeneratedColumn()
    id: MaterialDraftSk;

    @EntityId()
    entityId: string;

    // not null when editing
    @OneToOne(type => MaterialEditing, { onDelete: "SET NULL" })
    currentEditing: MaterialEditing | null;
    @RelationId((x: MaterialDraft) => x.currentEditing)
    currentEditingId: number | null;

    @Column({
        type: "enum",
        enum: MaterialType,
        nullable: true
    })
    intendedMaterialType: MaterialType | null;

    // one of content or space is specified and material is priority and content is secondary
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    @JoinColumn({ name: "materialId" })
    material: Material | null;
    @Column({ nullable: true })
    materialId: MaterialSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedContentDraftId" })
    intendedContentDraft: ContentDraft | null;
    @Column({ nullable: true })
    intendedContentDraftId: ContentDraftSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedSpaceId" })
    intendedSpace: Space | null;
    @Column({ nullable: true })
    intendedSpaceId: SpaceSk | null;

    @Column({ asExpression: "coalesce(materialId, intendedContentDraftId, intendedSpaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    @Column({ asExpression: "coalesce(materialId, -createdAt)", generatedType: "VIRTUAL" })
    unique_by_user_constrain: number;

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
        enum: MaterialChangeType,
        default: MaterialChangeType.INITIAL
    })
    changeType: MaterialChangeType;

    // null when committed
    @Column({ select: false, nullable: true })
    data: string | null;

    @Column({ type: "varchar", length: 140, nullable: true, asExpression: "left(data, 140)", generatedType: "STORED" })
    beginning: string | null;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}