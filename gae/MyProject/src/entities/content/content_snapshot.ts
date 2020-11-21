import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { ContentDraft, ContentDraftSk } from "./content_draft";
import { ContentEditing, ContentEditingSk } from "./content_editing";
import { Structure, StructureSk } from "../format/structure";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export type ContentSnapshotSk = SurrogateKey<"ContentSnapshot">;

@Entity()
export class ContentSnapshot {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @ManyToOne(type => ContentDraft, { onDelete: "CASCADE" })
    @JoinColumn({ name: "draftId" })
    draft: ContentDraft;
    @Column()
    draftId: ContentDraftSk;

    @ManyToOne(type => ContentEditing, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "editingId" })
    editing: ContentEditing;
    @Column()
    editingId: ContentEditingSk;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @UpdatedAt()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}