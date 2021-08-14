import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Structure, StructureSk } from "../format/Structure";
import { User, UserSk } from "../user/User";
import { createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Content, ContentSk } from "./Content";

export type ContentCommitSk = NewTypeInt<"ContentCommitSk">;

export type ContentCommitId = NewTypeString<"ContentCommitId">;

@Entity()
export class ContentCommit {

    @PrimaryGeneratedColumn()
    id: ContentCommitSk;

    @EntityId()
    entityId: ContentCommitId;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @JoinColumn({ name: "contentId" })
    content: Content;
    @Column()
    contentId: ContentSk;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @UpdatedAt()
    timestamp: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "committerUserId" })
    committerUser: User;
    @Column()
    committerUserId: UserSk;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as ContentCommitId;
        }
    }
}