import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content } from "../content/content";
import { ContentEditing, ContentEditingSk } from "../content/content_editing";
import { Material, MaterialType } from "./material";
import { MaterialCommit, MaterialCommitSk } from "./material_commit";
import { MaterialDraft, MaterialDraftSk } from "./material_draft";
import { MaterialSnapshot } from "./material_snapshot";
import { Space } from "../space/space";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export enum MaterialEditingState {
    EDITING = "editing",
    COMMITTED = "committed",
    CANCELD = "canceled"
}

export type MaterialEditingSk = SurrogateKey<"MaterialEditing">;

@Entity()
export class MaterialEditing {

    @PrimaryGeneratedColumn()
    id: MaterialEditingSk;

    @EntityId()
    entityId: string;

    @ManyToOne(type => MaterialDraft, { onDelete: "CASCADE" })
    @JoinColumn({ name: "draftId" })
    draft: MaterialDraft;
    @Column()
    draftId: MaterialDraftSk;

    @OneToOne(type => ContentEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "parentEditingId" })
    parentEditing: ContentEditing | null;
    @Column({ nullable: true })
    parentEditingId: ContentEditingSk | null;

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
        enum: MaterialEditingState,
        default: MaterialEditingState.EDITING
    })
    state: MaterialEditingState;

    @OneToMany(type => MaterialSnapshot, x => x.draft, { onDelete: "RESTRICT" })
    snapshots: MaterialSnapshot[];
}
