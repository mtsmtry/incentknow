import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { Container, ContainerSk } from "../container/container";
import { Content, ContentSk } from "../content/content";
import { User, UserSk } from "../user/user";
import { CreatedAt, createEntityId, EntityId } from '../utils';

export enum ReactorState {
    INVAILD = "invaild"
}

export type ReactorSk = NewTypeInt<"ReactorSk">;

export type ReactorId = NewTypeString<"ReactorId">;

@Entity()
export class Reactor {

    @PrimaryGeneratedColumn()
    id: ReactorSk;

    @EntityId()
    entityId: ReactorId;

    @OneToOne(type => Container, { onDelete: "CASCADE" })
    @JoinColumn({ name: "containerId" })
    container: Container;
    @Column()
    containerId: ContainerSk;

    @Column({
        type: "enum",
        enum: ReactorState,
        default: ReactorState.INVAILD
    })
    state: ReactorState;

    @OneToOne(type => Content, { onDelete: "SET NULL" })
    @JoinColumn({ name: "definitionId" })
    definition: Content | null;
    @Column({ nullable: true })
    definitionId: ContentSk | null;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as ReactorId;
    }
}