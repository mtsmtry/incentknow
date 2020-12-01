import { BeforeInsert, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "../content/content";
import { Space } from "../space/space";
import { User } from "../user/user";
import { CreatedAt, createEntityId, DisplayName, EntityId, UpdatedAt } from '../utils';

@Entity()
export class Crawler {

    @PrimaryGeneratedColumn()
    id: number;

    @EntityId()
    entityId: string;

    @OneToOne(type => Content, { onDelete: "SET NULL" })
    definition: Content;

    @DisplayName()
    displayName: string;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    creatorUser: User;

    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    updaterUser: User;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId();
    }
}
