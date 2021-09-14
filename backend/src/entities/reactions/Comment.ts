import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content, ContentSk } from "../content/Content";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';

export type CommentSk = NewTypeInt<"CommentSk">;

export type CommentId = NewTypeString<"CommentId">;

export enum CommentState {
    NORMAL = "normal",
    DELETED = "deleted",
}

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: CommentSk;

    @EntityId()
    entityId: CommentId;

    @ManyToOne(type => Content, { onDelete: "CASCADE" })
    @JoinColumn({ name: "contentId" })
    content: Content;
    @Column("int")
    contentId: ContentSk;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column("int")
    userId: UserSk;

    @ManyToOne(type => Comment, { onDelete: "CASCADE" })
    @JoinColumn({ name: "replyToCommentId" })
    replyToComment: Comment | null;
    @Column("int", { nullable: true })
    replyToCommentId: CommentSk | null;

    @Column({ type: "text" })
    text: string;

    @CreatedAt()
    createdAt: Date;

    @UpdatedAt()
    updatedAt: Date;

    @Column({ type: "enum", enum: CommentState, default: CommentState.NORMAL })
    state: CommentState;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as CommentId;
        }
    }
}