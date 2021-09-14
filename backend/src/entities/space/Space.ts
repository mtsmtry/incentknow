import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Container } from "../container/Container";
import { User, UserSk } from "../user/User";
import { CreatedAt, createDisplayId, createEntityId, DisplayId, DisplayName, EntityId } from '../Utils';
import { SpaceFollow } from "./SpaceFollow";
import { SpaceMember } from "./SpaceMember";

export enum MembershipMethod {
    NONE = "none",
    APP = "app"
}

export enum SpaceAuthority {
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
    headerImage: string | null;

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
        enum: SpaceAuthority,
        default: SpaceAuthority.NONE
    })
    defaultAuthority: SpaceAuthority;

    @OneToMany(type => SpaceFollow, s => s.space)
    followers: SpaceFollow[];

    @OneToMany(type => SpaceMember, s => s.space)
    members: SpaceMember[];

    @OneToMany(type => Container, s => s.space)
    containers: Container[];

    @BeforeInsert()
    onInsert() {
        if (!this.displayId) {
            this.displayId = createDisplayId() as SpaceDisplayId;
        }
        if (!this.entityId) {
            this.entityId = createEntityId() as SpaceId;
        }
    }
}

