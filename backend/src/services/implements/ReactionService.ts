import { ContentId } from "../../entities/content/Content";
import { CommentId } from "../../entities/reactions/Comment";
import { SpaceAuthority, SpaceId } from "../../entities/space/Space";
import { Int } from "../../Implication";
import { Authority } from "../../interfaces/content/Content";
import { IntactActivityBySpace, IntactActivityByUser } from "../../interfaces/reactions/Activity";
import { FocusedComment, FocusedTreeComment, toFocusedComment, toFocusedTreeComment } from "../../interfaces/reactions/Comment";
import { IntactNotification } from "../../interfaces/reactions/Notification";
import { ContentRepository } from "../../repositories/implements/content/ContentRepository.";
import { FormatRepository } from "../../repositories/implements/format/FormatRepository";
import { ActivityRepository } from "../../repositories/implements/reactions/ActivityRepository";
import { CommentRepository } from "../../repositories/implements/reactions/CommentRepository";
import { NotificationRepository } from "../../repositories/implements/reactions/NotificationRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../../repositories/implements/space/SpaceRepository";
import { UserRepository } from "../../repositories/implements/user/UserRepository";
import { checkAuthority, checkSpaceAuthority } from "../../repositories/queries/space/AuthorityQuery";
import { BaseService } from "../BaseService";
import { LackOfAuthority } from "../Errors";
import { ServiceContext } from "../ServiceContext";

export class ReactionService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private spaces: SpaceRepository,
        private con: ContentRepository,
        private format: FormatRepository,
        private users: UserRepository,
        private comments: CommentRepository,
        private act: ActivityRepository,
        private notif: NotificationRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    async commentContent(contentId: ContentId, text: string): Promise<FocusedTreeComment> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth] = await this.auth.fromAuths(trx).getContentAuthority(userId, contentId);
            checkAuthority(auth, Authority.WRITABLE);

            const user = await this.users.fromUsers(trx).byId(userId).getNeededOne();
            const content = await this.con.fromContents(trx).byEntityId(contentId).joinContainer().getNeededOne();
            const comment = await this.comments.createCommand(trx).createComment(userId, content.id, text, null);
            await this.act.createCommand(trx).createOnContentCommented(userId, content.container.spaceId, content.id, comment.id);
            await this.notif.createCommand(trx).createOnContentCommented(content.creatorUserId, userId, content.container.spaceId, content.id, comment.id);
            comment.user = user;
            return toFocusedTreeComment({ comment, raw: {} }, []);
        });
    }

    async replyToComment(commentId: CommentId, text: string): Promise<FocusedComment> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const user = await this.users.fromUsers(trx).byId(userId).getNeededOne();
            const replyToComment = await this.comments.fromComments(trx).byEntityId(commentId).joinContentAndContainer().getNeededOne();
            const comment = await this.comments.createCommand(trx).createComment(userId, replyToComment.contentId, text, replyToComment);
            const content = await this.con.fromContents(trx).byId(comment.contentId).joinContainer().getNeededOne();
            await this.act.createCommand(trx).createOnContentCommented(userId, replyToComment.content.container.spaceId, replyToComment.contentId, comment.id);
            comment.user = user;

            const [auth] = await this.auth.fromAuths(trx).getContentAuthority(userId, comment.contentId);
            checkAuthority(auth, Authority.WRITABLE);

            // Notificate
            const mentionedUsers = await this.comments.fromComments(trx).getMentionedUsers(replyToComment);
            const promises = mentionedUsers.map(async mentionedUserId => {
                await this.notif.createCommand(trx).createOnCommentReplied(mentionedUserId, userId, replyToComment.content.container.spaceId, content.id, comment.id);
            });
            await Promise.all(promises);

            return toFocusedComment({ comment, raw: {} });
        });
    }

    async modifyComment(commentId: CommentId, text: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const comment = await this.comments.fromComments(trx).byEntityId(commentId).getNeededOne();
            if (comment.userId != userId) {
                throw new LackOfAuthority();
            }
            await this.comments.createCommand(trx).updateComment(comment.id, text);
            return {};
        });
    }

    async likeComment(commentId: CommentId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const comment = await this.comments.fromComments(trx).byEntityId(commentId).getNeededOne();

            const [auth] = await this.auth.fromAuths(trx).getContentAuthority(userId, comment.contentId);
            checkAuthority(auth, Authority.WRITABLE);

            await this.comments.createCommand(trx).likeComment(userId, comment.id);
            return {};
        });
    }

    async unlikeComment(commentId: CommentId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const comment = await this.comments.fromComments(trx).byEntityId(commentId).getNeededOne();

            const [auth] = await this.auth.fromAuths(trx).getContentAuthority(userId, comment.contentId);
            checkAuthority(auth, Authority.WRITABLE);

            await this.comments.createCommand(trx).unlikeComment(userId, comment.id);
            return {};
        });
    }

    async getNotifications(): Promise<IntactNotification[]> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            return await this.notif.fromNotifications().byUser(userId).latest().limit(100).getIntactMany(this.con, this.format);
        });
    }

    async getActivitiesBySpace(spaceId: SpaceId): Promise<IntactActivityBySpace[]> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth] = await this.auth.fromAuths(trx).getSpaceAuthority(userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.READABLE);

            const space = await this.spaces.fromSpaces().byEntityId(spaceId).getNeededOne();
            return await this.act.fromActivities().bySpace(space.id).latest().limit(5).getManyBySpace(this.con, this.format);
        });
    }

    async getActivitiesByUser(spaceId: SpaceId): Promise<IntactActivityByUser[]> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            return await this.act.fromActivities().byUser(userId).latest().limit(5).getManyByUser(this.con, this.format);
        });
    }

    async getNotReadNotificationCount(): Promise<Int> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            return await this.notif.fromNotifications().byUser(userId).notRead().getCount();
        });
    }

    async readAllNotifications(): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.notif.createCommand(trx).readAllNotifications(userId);
            return {};
        });
    }
}