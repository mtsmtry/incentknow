import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "../content/content";
import { Space } from "../space/space";
import { CreatedAt, DisplayName } from '../utils';
import { CrawlerCache } from "./crawler_cache";

export enum CrawlerTaskMethod {
    CRAWLING = "crawling",
    SCRAPING = "scraping"
}

export enum CrawlerTaskStatus {
    PDENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED_FETCHING = "failedFetching",
    FAILED_SCRAPING = "failedScraping",
    FAILED_IMPORTING = "failedImporting"
}

export enum CrawlerTakeoverClass {
    NEW = "new",
    DUPLICATION = "duplication"
}

export interface CrawlerTaskOutput {
    indexes: {
        url: string,
        taskId: string | null,
        class: CrawlerTakeoverClass
    }[];
    contents: {
        contentId: string,
        version: number
    }[] | null;
}

@Entity()
export class CrawlerTask {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Content, { onDelete: "SET NULL" })
    scraper: Content;

    @DisplayName()
    displayName: string;

    @ManyToOne(type => Space, { onDelete: "CASCADE", nullable: false })
    space: Space;

    @CreatedAt()
    createdAt: Date;

    @Column({ nullable: true })
    startedAt: Date | null;

    @Column({ nullable: true })
    endedAt: Date | null;

    @Column()
    message: string | null;

    @Column("simple-json", { select: false })
    output: CrawlerTaskOutput;

    @OneToOne(type => CrawlerCache, { onDelete: "SET NULL" })
    cache: CrawlerCache;
}