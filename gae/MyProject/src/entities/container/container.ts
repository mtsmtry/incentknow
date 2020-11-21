import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Format, FormatSk } from "../format/format";
import { Space, SpaceSk } from "../space/space";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

export enum ContentGenerator {
    NONE = "none",
    REACTOR = "reactor",
    CRAWLER = "crawler"
}

export type ContainerSk = SurrogateKey<"Container">;

@Entity()
@Unique(["space", "format"])
export class Container {

    @PrimaryGeneratedColumn()
    id: ContainerSk;

    @EntityId()
    entityId: string;

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
        this.entityId = createEntityId();
    }
}