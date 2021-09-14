import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content, ContentSk } from "../content/Content";
import { ContentDraft, ContentDraftSk } from "../content/ContentDraft";
import { Space, SpaceSk } from "../space/Space";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Comment, CommentSk } from "./Comment";

export enum NotificationType {
    CONTENT_COMMENTED = "content_commented",
    COMMENT_REPLIED = "comment_replied"
}

export type NotificationSk = NewTypeInt<"NotificationSk">;

export type NotificationId = NewTypeString<"NotificationId">;

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: NotificationSk;

    @EntityId()
    entityId: NotificationId;

    @ManyToOne(type => Space, { onDelete: "CASCADE" })
    @JoinColumn({ name: "spaceId" })
    space: Space;
    @Column("int")
    spaceId: SpaceSk;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column("int")
    userId: UserSk;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @JoinColumn({ name: "notifiableContentId" })
    notifiableContent: Content;
    @Column("int", { nullable: true })
    notifiableContentId: ContentSk;

    @ManyToOne(type => Comment, { onDelete: "CASCADE" })
    @JoinColumn({ name: "notifiableCommentId" })
    notifiableComment: Comment;
    @Column("int", { nullable: true })
    notifiableCommentId: CommentSk;

    @Column({ type: "enum", enum: NotificationType })
    type: NotificationType;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "notifiedFromUserId" })
    notifiedFromUser: User;
    @Column("int")
    notifiedFromUserId: UserSk;

    @CreatedAt()
    timestamp: Date;

    @Column({ default: false })
    isRead: boolean

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as NotificationId;
        }
    }
}