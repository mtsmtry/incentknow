import { Activity, ActivityId, ActivityType } from "../../entities/reactions/Activity";
import { Data, DataKind, DataMember } from "../../Implication";
import { RelatedContent } from "../content/Content";
import { RelatedSpace, toRelatedSpace } from "../space/Space";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedComment, toRelatedComment } from "./Comment";

@Data()
export class ActivityAction {
    @DataKind()
    type: ActivityType;

    @DataMember([ActivityType.CONTENT_CREATED, ActivityType.CONTENT_UPDATED, ActivityType.CONTENT_COMMENTED])
    content?: RelatedContent;

    @DataMember([ActivityType.CONTENT_COMMENTED])
    comment?: RelatedComment;
}

export interface IntactActivityBySpace {
    activityId: ActivityId;
    action: ActivityAction;
    actorUser: RelatedUser;
    timestamp: number;
}

function toAction(activity: Activity, content: RelatedContent | null): ActivityAction {
    if (activity.targetComment) {
        activity.targetComment.user = activity.actorUser;
    }
    return {
        type: activity.type,
        content: content ? content : undefined,
        comment: activity.targetComment ? toRelatedComment(activity.targetComment) : undefined
    };
}

export function toIntactActivityBySpace(activity: Activity, content: RelatedContent | null): IntactActivityBySpace {
    return {
        activityId: activity.entityId,
        actorUser: toRelatedUser(activity.actorUser),
        timestamp: toTimestamp(activity.timestamp),
        action: toAction(activity, content)
    };
}

export interface IntactActivityByUser {
    activityId: ActivityId;
    action: ActivityAction;
    space: RelatedSpace;
    timestamp: number;
}

export function toIntactActivityByUser(activity: Activity, content: RelatedContent | null): IntactActivityByUser {
    return {
        activityId: activity.entityId,
        space: toRelatedSpace(activity.space),
        timestamp: toTimestamp(activity.timestamp),
        action: toAction(activity, content)
    }
};