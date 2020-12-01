import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Content } from "../content/content";
import { Space } from "../space/space";
import { CreatedAt, UpdatedAt } from '../utils';
import { CrawlerOperation } from "./crawler_operation";

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