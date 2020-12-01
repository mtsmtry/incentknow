import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../implication";
import { Format, FormatSk } from "../format/format";
import { Space, SpaceSk } from "../space/space";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../utils';

export enum ContentGenerator {
    NONE = "none",
    REACTOR = "reactor",
    CRAWLER = "crawler"
}

export type ContainerSk = NewTypeInt<"ContainerSk">;

export type ContainerId = NewTypeString<"ContainerId">;

@Entity()
@Unique(["space", "format"])
export class Container {

    @PrimaryGeneratedColumn()
    id: ContainerSk;

    @EntityId()
    entityId: ContainerId;

    @ManyToOne(type => Space, { onDelete: "RESTRICT", nullable: false })
    @JoinColumn({ name: "spaceId" })
    space: Space;
    @Column()
    spaceId: SpaceSk;

    @ManyToOne(type => Format, { onDelete: "RESTRICT", nullable: false })
    @JoinColumn({ name: "formatId" })
    format: Format;
    @Column()
    formatId: FormatSk;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @Column({
        type: "enum",
        enum: ContentGenerator,
        nullable: true
    })
    generator: ContentGenerator | null;

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as ContainerId;
    }
}