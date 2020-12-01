import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { Content } from "../content/content";
import { ContentCommit, ContentCommitSk } from "../content/content_commit";
import { User, UserSk } from "../user/user";
import { createEntityId, EntityId, UpdatedAt } from '../utils';
import { Material, MaterialSk } from "./material";
import { MaterialEditing, MaterialEditingSk } from "./material_editing";

export type MaterialCommitSk = NewTypeInt<"MaterialCommitSk">;

export type MaterialCommitId = NewTypeString<"MaterialCommitId">;

@Entity()
export class MaterialCommit {

    @PrimaryGeneratedColumn()
    id: MaterialCommitSk;

    @EntityId()
    entityId: MaterialCommitId;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @Index()
    @JoinColumn({ name: "materialId" })
    material: Material;
    @Column()
    materialId: MaterialSk;

    @OneToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "parentCommitId" })
    parentCommit: ContentCommit | null;
    @Column({ nullable: true })
    parentCommitId: ContentCommitSk | null;

    @OneToOne(type => MaterialEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "editingId" })
    editing: MaterialEditing;
    @Column()
    editingId: MaterialEditingSk;

    @Column({ select: false })
    data: string;

    @Column({ asExpression: "char_length(`data`)", generatedType: "STORED" })
    dataSize: number;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "basedCommitId" })
    basedCommit: MaterialCommit | null;
    @Column({ nullable: true })
    basedCommitId: MaterialCommitSk | null;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "committerUserId" })
    committerUser: User;
    @Column()
    committerUserId: UserSk;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as MaterialCommitId;
    }
}