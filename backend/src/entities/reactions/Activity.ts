import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content, ContentSk } from "../content/Content";
import { ContentDraft, ContentDraftSk } from "../content/ContentDraft";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Comment, CommentSk } from "./Comment";

export enum ActivityType {
    CONTENT_CREATED = "content_created",
    CONTENT_UPDATED = "content_updated",
    CONTENT_COMMENTED = "content_commented"
}

export type ActivitySk = NewTypeInt<"ActivitySk">;

export type ActivityId = NewTypeString<"ActivityId">;

@Entity()
export class Activity {

    @PrimaryGeneratedColumn()
    id: ActivitySk;

    @EntityId()
    entityId: ActivityId;

    @ManyToOne(type => Space, { onDelete: "CASCADE" })
    @JoinColumn({ name: "spaceId" })
    space: Space;
    @Column("int")
    spaceId: SpaceSk;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @JoinColumn({ name: "targetContentId" })
    targetContent: Content | null;
    @Column("int", { nullable: true })
    targetContentId: ContentSk | null;

    @ManyToOne(type => Comment, { onDelete: "CASCADE" })
    @JoinColumn({ name: "targetCommentId" })
    targetComment: Comment | null;
    @Column("int", { nullable: true })
    targetCommentId: CommentSk | null;

    @Column({ type: "enum", enum: ActivityType })
    type: ActivityType;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "actorUserId" })
    actorUser: User;
    @Column("int")
    actorUserId: UserSk;

    @CreatedAt()
    timestamp: Date;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as ActivityId;
        }
    }
}