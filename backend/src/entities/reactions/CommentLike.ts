import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { NewTypeInt } from "../../Implication";
import { User, UserSk } from "../user/User";
import { CreatedAt } from '../Utils';
import { Comment, CommentSk } from "./Comment";

export type CommentLikeSk = NewTypeInt<"CommentLikeSk">;

@Entity()
@Unique(["comment", "user"])
export class CommentLike {

    @PrimaryGeneratedColumn()
    id: CommentLikeSk;

    @ManyToOne(type => Comment, { onDelete: "CASCADE" })
    @JoinColumn({ name: "commentId" })
    comment: Comment;
    @Column("int")
    commentId: CommentSk;

    @ManyToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
    @Column("int")
    userId: UserSk;

    @CreatedAt()
    createdAt: Date;
}