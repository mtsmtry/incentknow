import { BeforeInsert, Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Container, ContainerSk } from "../container/Container";
import { Content, ContentSk } from "../content/Content";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId } from '../Utils';

export enum ReactorState {
    INVAILD = "invaild"
}

export type ReactorSk = NewTypeInt<"ReactorSk">;

export type ReactorId = NewTypeString<"ReactorId">;

// @Entity()
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
    @Column("int", { nullable: true })
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