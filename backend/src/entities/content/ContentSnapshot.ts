import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Structure, StructureSk } from "../format/Structure";
import { createEntityId, EntityId, UpdatedAt } from '../Utils';
import { ContentDraft, ContentDraftSk } from "./ContentDraft";
import { ContentEditing, ContentEditingSk } from "./ContentEditing";

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