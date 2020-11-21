import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Container, ContainerSk } from "../container/container";
import { Content, ContentSk } from "../content/content";
import { User, UserSk } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId } from '../utils';

export enum ReactorState {
    INVAILD = "invaild"
}

@Entity()
export class Reactor {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

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
    creatorUserId: UserSk ;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}