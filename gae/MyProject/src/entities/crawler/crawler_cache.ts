import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { Content } from "../content/content";
import { CrawlerOperation } from "./crawler_operation";
import { Space } from "../space/space";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId } from '../utils';

export enum CrawlerCacheStatus {
    STORED = "stored",
    DELETED = "deleted"
}

@Entity()
export class CrawlerCache {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    operation: CrawlerOperation;
    @RelationId((x: CrawlerCache) => x.operation)
    operationId: number;

    @OneToOne(type => Content, { onDelete: "SET NULL" })
    scraper: Content | null;

    @Column()
    url: string;

    @Column({
        type: "enum",
        enum: CrawlerCacheStatus,
        default: CrawlerCacheStatus.STORED
    })
    status: CrawlerCacheStatus;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;
}