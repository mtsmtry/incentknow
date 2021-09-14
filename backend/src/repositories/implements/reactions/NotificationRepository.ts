import { ContentSk } from "../../../entities/content/Content";
import { CommentSk } from "../../../entities/reactions/Comment";
import { Notification, NotificationType } from "../../../entities/reactions/Notification";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { NotificationQuery } from "../../queries/reactions/NotificationQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class NotificationRepository implements BaseRepository<NotificationCommand> {
    constructor(
        private notifications: Repository<Notification>) {
    }

    fromNotifications(trx?: Transaction) {
        return new NotificationQuery(this.notifications.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new NotificationCommand(this.notifications.createCommand(trx));
    }
}

export class NotificationCommand implements BaseCommand {
    constructor(private notifications: Command<Notification>) {
    }

    async createOnContentCommented(toUserId: UserSk, fromUserId: UserSk, spaceId: SpaceSk, contentId: ContentSk, commentId: CommentSk) {
        if (toUserId == fromUserId) {
            return;
        }
        let notification = this.notifications.create({
            userId: toUserId,
            spaceId,
            notifiableContentId: contentId,
            notifiableCommentId: commentId,
            notifiedFromUserId: fromUserId,
            type: NotificationType.CONTENT_COMMENTED
        });
        notification = await this.notifications.save(notification);
    }

    async createOnCommentReplied(toUserId: UserSk, fromUserId: UserSk, spaceId: SpaceSk, contentId: ContentSk, commentId: CommentSk) {
        if (toUserId == fromUserId) {
            return;
        }
        let notification = this.notifications.create({
            userId: toUserId,
            spaceId,
            notifiableContentId: contentId,
            notifiableCommentId: commentId,
            notifiedFromUserId: fromUserId,
            type: NotificationType.COMMENT_REPLIED
        });
        notification = await this.notifications.save(notification);
    }

    async readAllNotifications(userId: UserSk) {
        await this.notifications.update({ userId }, { isRead: true });
    }
}