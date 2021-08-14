import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content } from "../content/Content";
import { ContentDraft, ContentDraftSk } from "../content/ContentDraft";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Material, MaterialSk, MaterialType } from "./Material";
import { MaterialEditing, MaterialEditingSk } from "./MaterialEditing";

export enum MaterialChangeType {
    INITIAL = "initial",
    WRITE = "write",
    REMOVE = "remove"
}

export enum MaterialType2 {
    PLAINTEXT = "plaintext",
    DOCUMENT = "document"
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

    @Column({ type: "enum", enum: MaterialType2 })
    intendedMaterialType: MaterialType;

    // one of content or space is specified and material is priority and content is secondary
    @ManyToOne(type => Content, { onDelete: "SET NULL" })
    @JoinColumn({ name: "materialId" })
    material: Material | null;
    @Column("int", { nullable: true })
    materialId: MaterialSk | null;

    @ManyToOne(type => ContentDraft, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedContentDraftId" })
    intendedContentDraft: ContentDraft | null;
    @Column("int", { nullable: true })
    intendedContentDraftId: ContentDraftSk | null;

    @ManyToOne(type => Space, { onDelete: "SET NULL" })
    @JoinColumn({ name: "intendedSpaceId" })
    intendedSpace: Space | null;
    @Column("int", { nullable: true })
    intendedSpaceId: SpaceSk | null;

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

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as MaterialDraftId;
        }
    }
}