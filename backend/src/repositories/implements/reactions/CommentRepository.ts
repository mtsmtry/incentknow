import { ContentSk } from "../../../entities/content/Content";
import { Material } from "../../../entities/material/Material";
import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { Comment, CommentSk, CommentState } from "../../../entities/reactions/Comment";
import { CommentLike } from "../../../entities/reactions/CommentLike";
import { UserSk } from "../../../entities/user/User";
import { CommentQuery } from "../../queries/reactions/CommentQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class CommentRepository implements BaseRepository<CommentCommand> {
    constructor(
        private comments: Repository<Comment>, 
        private likes: Repository<CommentLike>) {
    }

    fromComments(trx?: Transaction) {
        return new CommentQuery(this.comments.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new CommentCommand(this.comments.createCommand(trx), this.likes.createCommand(trx));
    }
}

export class CommentCommand implements BaseCommand {
    constructor(private comments: Command<Comment>, private likes: Command<CommentLike>) {
    }

    async createComment(userId: UserSk, contentId: ContentSk, text: string, replyTo: Comment | null) {
        if (replyTo && contentId != replyTo.contentId) {
            throw Error("違うコンテンツのコメントにリプライはできません");
        }
        let comment = this.comments.create({ userId, contentId, text, replyToCommentId: replyTo?.id });
        comment = await this.comments.save(comment);
        return comment;
    }

    async updateComment(commentId: CommentSk, text: string) {
        await this.comments.update(commentId, { text });
    }

    async deleteComment(commentId: CommentSk) {
        await this.comments.update(commentId, { state: CommentState.DELETED });
    }

    async likeComment(userId: UserSk, commentId: CommentSk) {
        let like = this.likes.create({ userId, commentId });
        like = await this.likes.save(like);
    }

    async unlikeComment(userId: UserSk, commentId: CommentSk) {
        await this.likes.delete({ userId, commentId });
    }
}