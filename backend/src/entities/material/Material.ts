import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content, ContentSk } from "../content/Content";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { MaterialCommit, MaterialCommitSk } from "./MaterialCommit";

export enum MaterialType {
    PLAINTEXT = "plaintext",
    DOCUMENT = "document"
}

export type MaterialSk = NewTypeInt<"MaterialSk">;

export type MaterialId = NewTypeString<"MaterialId">;

@Entity()
export class Material {

    @PrimaryGeneratedColumn()
    id: MaterialSk;

    @EntityId()
    entityId: MaterialId;

    @ManyToOne(type => Content, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "contentId" })
    content: Content | null;
    @Column("int", { nullable: true })
    contentId: ContentSk | null;

    @ManyToOne(type => Space, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "spaceId" })
    space: Space | null;
    @Column("int", { nullable: true })
    spaceId: SpaceSk | null;

    @Column({ asExpression: "coalesce(contentId, spaceId)", generatedType: "VIRTUAL" })
    not_null_constrain: number;

    @Column({ type: "enum", enum: MaterialType })
    materialType: MaterialType;

    @OneToOne(type => MaterialCommit, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "commitId" })
    commit: MaterialCommit;
    @Column({ nullable: true }) // トランザクション外ではnullにならない
    commitId: MaterialCommitSk;

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
        if (!this.entityId) {
            this.entityId = createEntityId() as MaterialId;
        }
    }
}
