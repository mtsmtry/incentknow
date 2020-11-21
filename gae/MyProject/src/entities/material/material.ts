import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content, ContentSk } from "../content/content";
import { MaterialCommit } from "./material_commit";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export enum MaterialType {
    FOLDER = "folder",
    DOCUMENT = "document"
}

export type MaterialSk = SurrogateKey<"Material">;

@Entity()
export class Material {

    @PrimaryGeneratedColumn()
    id: MaterialSk;

    @EntityId()
    entityId: string;

    @ManyToOne(type => Content, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "contentId" })
    content: Content | null;
    @Column({ nullable: true })
    contentId: ContentSk | null;

    @ManyToOne(type => Space, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "spaceId" })
    space: Space | null;
    @Column({ nullable: true })
    spaceId: SpaceSk | null;

    @Column({ asExpression: "coalesce(contentId, spaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    @Column({ type: "varchar", length: 140, asExpression: "left(data, 140)", generatedType: "STORED" })
    beginning: string;

    @Column({
        type: "enum",
        enum: MaterialType
    })
    materialType: MaterialType;

    @Column({ select: false })
    data: string;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "updaterUserId" })
    updaterUser: User;
    @Column()
    updaterUserId: UserSk;

    @OneToMany(type => MaterialCommit, strc => strc.material, { onDelete: "RESTRICT" })
    commits: MaterialCommit[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}
