import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { User } from "../user/user";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId } from '../utils';

export enum CrawlerOperationMethod {
    CRAWLING = "crawling",
    SCRAPING = "scraping"
}

export enum CrawlerOperationStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed"
}

@Entity()
export class CrawlerOperation {

    @PrimaryGeneratedColumn()
    id: number;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    executorUser: User;

    @Column({
        type: "enum",
        enum: CrawlerOperationMethod
    })
    method: CrawlerOperationMethod;

    @Column()
    startedAt: Date | null;

    @Column()
    endedAt: Date | null;

    @Column({
        type: "enum",
        enum: CrawlerOperationStatus,
        default: CrawlerOperationStatus.PENDING
    })
    status: CrawlerOperationStatus;
}
