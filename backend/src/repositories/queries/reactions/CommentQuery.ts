import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { Comment, CommentId, CommentSk } from "../../../entities/reactions/Comment";
import { UserSk } from "../../../entities/user/User";
import { toFocusedTreeComment } from "../../../interfaces/reactions/Comment";
import { groupBy } from "../../../Utils";
import { mapQuery } from "../MappedQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class CommentQuery extends SelectFromSingleTableQuery<Comment, CommentQuery, CommentSk, CommentId, null> {
    constructor(qb: SelectQueryBuilder<Comment>) {
        super(qb, CommentQuery);
    }

    byContent(contentId: ContentSk) {
        return new CommentQuery(this.qb.where({ contentId }));
    }

    joinContentAndContainer() {
        return new CommentQuery(this.qb.leftJoinAndSelect("x.content", "content").leftJoinAndSelect("content.container", "container"));
    }

    private joinAndSelectFocused() {
        const query = this.qb
            .leftJoinAndSelect("x.user", "user")
            .addSelect("(SELECT COUNT(*) FROM comment_like WHERE commentId = x.id)", "likeCount");
        return mapQuery(query, (x, raw) => ({ comment: x, raw }))
    }

    async getFocusedTreeMany() {
        const comments = await this.joinAndSelectFocused().getMany();
        const replies = groupBy(comments, x => x.comment.replyToCommentId);
        const treeComments = comments
            .filter(x => x.comment.replyToCommentId == null)
            .map(x => toFocusedTreeComment(x, replies[x.comment.id]))
            .sort((a, b) => b.createdAt - a.createdAt);
        return treeComments;
    }

    async getMentionedUsers(comment: Comment) {
        const results = await this.qb.where({ replyToCommentId: comment.id }).groupBy("x.userId").select("x.userId").getRawMany();
        const users = results.map(x => x["x_userId"] as UserSk);
        if (!users.includes(comment.userId)) {
            users.push(comment.userId);
        }
        return users;
    }
}