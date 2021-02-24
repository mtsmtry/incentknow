import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt } from "../../Implication";
import { Space, SpaceSk } from "./Space";
import { User, UserSk } from "../user/User";
import { CreatedAt } from '../Utils';

export type SpaceMembershipApplicationSk = NewTypeInt<"SpaceMembershipApplicationSk">;

@Entity()
@Unique(["space", "user"])
export class SpaceMembershipApplication {

    @PrimaryGeneratedColumn()
    id: SpaceMembershipApplicationSk;

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
    appliedAt: Date;
}