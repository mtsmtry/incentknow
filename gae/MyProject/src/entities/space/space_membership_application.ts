import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Space, SpaceSk } from "../space/space";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export type SpaceMembershipApplicationSk = SurrogateKey<"SpaceMembershipApplication">;

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