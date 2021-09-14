import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Content, ContentSk } from "../content/Content";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, EntityId, UpdatedAt } from '../Utils';
import { Comment, CommentSk } from "./Comment";

export type ContentLikeSk = NewTypeInt<"ContentLikeSk">;

@Entity()
@Unique(["content", "user"])
export class ContentLike {

    @PrimaryGeneratedColumn()
    id: ContentLikeSk;

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

    @CreatedAt()
    createdAt: Date;
}