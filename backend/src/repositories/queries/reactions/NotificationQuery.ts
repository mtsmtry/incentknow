import { SelectQueryBuilder } from "typeorm";
import { Notification, NotificationId, NotificationSk } from "../../../entities/reactions/Notification";
import { UserSk } from "../../../entities/user/User";
import { Authority } from "../../../interfaces/content/Content";
import { toIntactNotification } from "../../../interfaces/reactions/Notification";
import { mapByString, notNull } from "../../../Utils";
import { ContentRepository } from "../../implements/content/ContentRepository.";
import { FormatRepository } from "../../implements/format/FormatRepository";
import { ContentQuery } from "../content/ContentQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class NotificationQuery extends SelectFromSingleTableQuery<Notification, NotificationQuery, NotificationSk, NotificationId, null> {
    constructor(qb: SelectQueryBuilder<Notification>) {
        super(qb, NotificationQuery);
    }

    byUser(userId: UserSk) {
        return new NotificationQuery(this.qb.where({ userId }));
    }

    notRead() {
        return new NotificationQuery(this.qb.andWhere("NOT x.isRead"));
    }

    latest() {
        return new NotificationQuery(this.qb.orderBy("x.timestamp", "DESC"));
    }

    private joinIntact() {
        let query = this.qb
            .leftJoinAndSelect("x.notifiedFromUser", "notifiedFromUser")
            .leftJoinAndSelect("x.notifiableComment", "notifiableComment")
            .leftJoinAndSelect("notifiableComment.user", "notifiableCommentUser")
            .leftJoinAndSelect("x.notifiableContent", "notifiableContent");
        query = ContentQuery.joinRelated(query, "notifiableContent");
        return query;
    }

    async getIntactMany(rep: ContentRepository, formatRep: FormatRepository) {
        const activities = await this.joinIntact().getMany();
        const rawContents = activities.map(x => x.notifiableContent).filter(notNull);
        const contents = await ContentQuery.makeRelatedMany(rawContents, Authority.READABLE, rep, formatRep);
        const contentMap = mapByString(contents, x => x.contentId);
        return activities.map(x => toIntactNotification(x, contentMap[x.notifiableContent.entityId]));
    }
}