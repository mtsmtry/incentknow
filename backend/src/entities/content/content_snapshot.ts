import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { Structure, StructureSk } from "../format/structure";
import { createEntityId, EntityId, UpdatedAt } from '../utils';
import { ContentDraft, ContentDraftSk } from "./content_draft";
import { ContentEditing, ContentEditingSk } from "./content_editing";

export type ContentSnapshotSk = NewTypeInt<"ContentSnapshotSk">;

export type ContentSnapshotId = NewTypeString<"ContentSnapshotId">;

@Entity()
export class ContentSnapshot {

    @PrimaryGeneratedColumn()
    id: ContentSnapshotSk;

    @EntityId()
    entityId: ContentSnapshotId;

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
        this.entityId = createEntityId() as ContentSnapshotId;
    }
}