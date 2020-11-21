import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content, ContentSk } from "./content";
import { Structure, StructureSk } from "../format/structure";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export type ContentCommitSk = SurrogateKey<"ContentCommit">;

@Entity()
export class ContentCommit {

    @PrimaryGeneratedColumn()
    id: ContentCommitSk;

    @EntityId()
    entityId: string;

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

    @ManyToOne(type => ContentCommit, { onDelete: "SET NULL" })
    @JoinColumn({ name: "forkedCommitId" })
    forkedCommit: ContentCommit | null;
    @Column({ nullable: true })
    forkedCommitId: ContentCommitSk | null;

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