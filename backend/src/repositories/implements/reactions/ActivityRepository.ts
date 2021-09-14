import { ContentSk } from "../../../entities/content/Content";
import { Material } from "../../../entities/material/Material";
import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { Activity, ActivityType } from "../../../entities/reactions/Activity";
import { Comment, CommentSk, CommentState } from "../../../entities/reactions/Comment";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { ActivityQuery } from "../../queries/reactions/ActivityQuery";
import { CommentQuery } from "../../queries/reactions/CommentQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class ActivityRepository implements BaseRepository<ActivityCommand> {
    constructor(
        private activities: Repository<Activity>) {
    }

    fromActivities(trx?: Transaction) {
        return new ActivityQuery(this.activities.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ActivityCommand(this.activities.createCommand(trx));
    }
}

export class ActivityCommand implements BaseCommand {
    constructor(private activities: Command<Activity>) {
    }

    async createOnContentCreated(userId: UserSk, spaceId: SpaceSk, contentId: ContentSk) {
        let activity = this.activities.create({ 
            actorUserId: userId, 
            spaceId, 
            targetContentId: contentId,
            type: ActivityType.CONTENT_CREATED
        });
        activity = await this.activities.save(activity);
    }

    async createOnContentUpdated(userId: UserSk, spaceId: SpaceSk, contentId: ContentSk) {
        let activity = this.activities.create({ 
            actorUserId: userId, 
            spaceId, 
            targetContentId: contentId,
            type: ActivityType.CONTENT_UPDATED
        });
        activity = await this.activities.save(activity);
    }

    async createOnContentCommented(userId: UserSk, spaceId: SpaceSk, contentId: ContentSk, commentId: CommentSk) {
        let activity = this.activities.create({ 
            actorUserId: userId, 
            spaceId, 
            targetContentId: contentId,
            targetCommentId: commentId,
            type: ActivityType.CONTENT_COMMENTED
        });
        activity = await this.activities.save(activity);
    }
}