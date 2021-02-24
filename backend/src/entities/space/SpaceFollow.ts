import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt } from "../../Implication";
import { Space, SpaceSk } from "./Space";
import { User, UserSk } from "../user/User";
import { CreatedAt } from '../Utils';

export type SpaceFollowSk = NewTypeInt<"SpaceFollowSk">;

@Entity()
export class SpaceFollow {

    @PrimaryGeneratedColumn()
    id: SpaceFollowSk;

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
    followedAt: Date;
}