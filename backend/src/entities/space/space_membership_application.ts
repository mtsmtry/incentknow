import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt } from "../../implication";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { CreatedAt } from '../utils';

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