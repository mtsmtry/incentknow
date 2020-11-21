import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export enum MembershipMethod {
    NONE = "none",
    APP = "app"
}

export enum SpaceAuth {
    NONE = "none",
    VISIBLE = "visible",
    READABLE = "readable",
    WRITABLE = "writable"
}

export type SpaceSk = SurrogateKey<"Space">;

@Entity()
export class Space {

    @PrimaryGeneratedColumn()
    id: SpaceSk;

    @EntityId()
    entityId: string;

    @DisplayId()
    displayId: string;

    @DisplayName()
    displayName: string;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    @Column()
    description: string;

    @Column({ nullable: true })
    homeUrl: string | null;

    @Column({
        type: "enum",
        enum: MembershipMethod,
        default: MembershipMethod.NONE
    })
    membershipMethod: MembershipMethod;

    @Column({ default: false })
    published: boolean;

    @Column({
        type: "enum",
        enum: SpaceAuth,
        default: SpaceAuth.NONE
    })
    defaultAuthority: SpaceAuth;

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    }
}

