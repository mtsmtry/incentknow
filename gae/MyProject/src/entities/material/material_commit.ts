import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content } from "../content/content";
import { ContentCommit, ContentCommitSk } from "../content/content_commit";
import { Material, MaterialSk } from "./material";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';
import { MaterialEditing, MaterialEditingSk } from "./material_editing";

export type MaterialCommitSk = SurrogateKey<"MaterialCommit">;

@Entity()
export class MaterialCommit {

    @PrimaryGeneratedColumn()
    id: MaterialCommitSk;

    @EntityId()
    entityId: string;

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
    @JoinColumn({ name: "forkedCommitId" })
    forkedCommit: MaterialCommit | null;
    @Column({ nullable: true })
    forkedCommitId: MaterialCommitSk | null;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "committerUserId" })
    committerUser: User;
    @Column()
    committerUserId: UserSk;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}