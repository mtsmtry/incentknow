import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { User, UserSk } from "../user/User";
import { CreatedAt, createDisplayId, createEntityId, DisplayId, DisplayName, EntityId } from '../Utils';
import { SpaceFollow } from "./SpaceFollow";

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

export type SpaceSk = NewTypeInt<"SpaceSk">;

export type SpaceId = NewTypeString<"SpaceId">;

export type SpaceDisplayId = NewTypeString<"SpaceDisplayId">;

@Entity()
export class Space {

    @PrimaryGeneratedColumn()
    id: SpaceSk;

    @EntityId()
    entityId: SpaceId;

    @DisplayId()
    displayId: SpaceDisplayId;

    @DisplayName()
    displayName: string;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    @Column()
    description: string;

    @Column("varchar", { length: 100, nullable: true })
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

    @OneToMany(type => SpaceFollow, strc => strc.spaceId, { onDelete: "CASCADE" })
    followers: SpaceFollow[];

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId() as SpaceDisplayId;
        this.entityId = createEntityId() as SpaceId;
    }
}

