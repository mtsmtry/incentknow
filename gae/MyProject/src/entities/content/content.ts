import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Container, ContainerSk } from "../container/container";
import { ContentCommit } from "./content_commit";
import { Structure, StructureSk } from "../format/structure";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export type ContentSk = SurrogateKey<"Content">;

@Entity()
export class Content {

    @PrimaryGeneratedColumn()
    id: ContentSk;

    @EntityId()
    entityId: string;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Container, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "containerId" })
    container: Container;
    @Column()
    containerId: ContainerSk;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    // 帰属するMaterialの更新も含む
    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "updaterUserId" })
    updaterUser: User;
    @Column()
    updaterUserId: UserSk;

    @Column({ default: 1 })
    updateCount: number;

    @Column({ default: 0 })
    viewCount: number;

    @OneToMany(type => ContentCommit, strc => strc.content, { onDelete: "RESTRICT" })
    commits: ContentCommit[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}
