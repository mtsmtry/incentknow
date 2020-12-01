import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt } from "../../implication";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { CreatedAt } from '../utils';

export enum MemberType {
    NORMAL = "normal",
    OWNER = "owner"
}

export type SpaceMemberSk = NewTypeInt<"SpaceMemberSk">;

@Entity()
@Unique(["space", "user"])
export class SpaceMember {

    @PrimaryGeneratedColumn()
    id: SpaceMemberSk;

    @ManyToOne(type => Space, { onDelete: "CASCADE" })
    @JoinColumn({ name: "spaceId" })
    space: Space;
    @Column()
    spaceId: SpaceSk;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column()
    userId: UserSk;

    @CreatedAt()
    joinedAt: Date;

    @Column({
        type: "enum",
        enum: MemberType
    })
    type: MemberType;
}