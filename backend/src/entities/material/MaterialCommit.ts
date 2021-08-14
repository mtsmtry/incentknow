import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { BlockType, Document } from "../../interfaces/material/Material";
import { Content } from "../content/Content";
import { ContentCommit, ContentCommitSk } from "../content/ContentCommit";
import { User, UserSk } from "../user/User";
import { createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Material, MaterialSk } from "./Material";
import { MaterialEditing, MaterialEditingSk } from "./MaterialEditing";

export type MaterialCommitSk = NewTypeInt<"MaterialCommitSk">;

export type MaterialCommitId = NewTypeString<"MaterialCommitId">;

@Entity()
export class MaterialCommit {

    @PrimaryGeneratedColumn()
    id: MaterialCommitSk;

    @EntityId()
    entityId: MaterialCommitId;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @JoinColumn({ name: "materialId" })
    material: Material;
    @Column()
    materialId: MaterialSk;

    @OneToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "parentCommitId" })
    parentCommit: ContentCommit | null;
    @Column("int", { nullable: true })
    parentCommitId: ContentCommitSk | null;

    @OneToOne(type => MaterialEditing, { onDelete: "SET NULL" })
    @JoinColumn({ name: "editingId" })
    editing: MaterialEditing | null;
    @Column("int", { nullable: true })
    editingId: MaterialEditingSk | null;

    @Column({ type: "text", select: false })
    data: string;

    @Column()
    textCount: number;

    @Column({ type: "varchar", length: 140 })
    beginning: string;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => MaterialCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "basedCommitId" })
    basedCommit: MaterialCommit | null;
    @Column("int", { nullable: true })
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

    @BeforeInsert()
    @BeforeUpdate()
    onUpdate() {
        if (this.data) {
            const doc: Document = JSON.parse(this.data);
            let text = "";
            doc.blocks.forEach(block => {
                if (block.data.text) {
                    text += block.data.text + " ";
                }
            });
            this.beginning = text.substring(0, 140);
            this.textCount = text.length;
        }
    }
}