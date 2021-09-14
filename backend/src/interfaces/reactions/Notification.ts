import { Activity, ActivityId } from "../../entities/reactions/Activity";
import { Notification, NotificationId, NotificationType } from "../../entities/reactions/Notification";
import { Data, DataKind, DataMember } from "../../Implication";
import { RelatedContent } from "../content/Content";
import { RelatedSpace, toRelatedSpace } from "../space/Space";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedComment, toRelatedComment } from "./Comment";

@Data()
export class NotificationAction {
    @DataKind()
    type: NotificationType;

    @DataMember([NotificationType.CONTENT_COMMENTED, NotificationType.COMMENT_REPLIED])
    content?: RelatedContent;

    @DataMember([NotificationType.CONTENT_COMMENTED, NotificationType.COMMENT_REPLIED])
    comment?: RelatedComment;
}

export interface IntactNotification {
    notificationId: NotificationId;
    action: NotificationAction;
    notifiedFromUser: RelatedUser;
    timestamp: number;
    isRead: boolean;
}

function toAction(notification: Notification, content: RelatedContent | null): NotificationAction {
    return {
        type: notification.type,
        content: content ? content : undefined,
        comment: notification.notifiableComment ? toRelatedComment(notification.notifiableComment) : undefined
    };
}

export function toIntactNotification(notification: Notification, content: RelatedContent | null): IntactNotification {
    return {
        notificationId: notification.entityId,
        notifiedFromUser: toRelatedUser(notification.notifiedFromUser),
        timestamp: toTimestamp(notification.timestamp),
        action: toAction(notification, content),
        isRead: notification.isRead
    };
}