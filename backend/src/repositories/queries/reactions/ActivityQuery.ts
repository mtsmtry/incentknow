import { SelectQueryBuilder } from "typeorm";
import { Activity, ActivityId, ActivitySk } from "../../../entities/reactions/Activity";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { Authority } from "../../../interfaces/content/Content";
import { toIntactActivityBySpace, toIntactActivityByUser } from "../../../interfaces/reactions/Activity";
import { mapByString, notNull } from "../../../Utils";
import { ContentRepository } from "../../implements/content/ContentRepository.";
import { FormatRepository } from "../../implements/format/FormatRepository";
import { ContentQuery } from "../content/ContentQuery";
import { SelectFromSingleTableQuery } from "../SelectQuery";

export class ActivityQuery extends SelectFromSingleTableQuery<Activity, ActivityQuery, ActivitySk, ActivityId, null> {
    constructor(qb: SelectQueryBuilder<Activity>) {
        super(qb, ActivityQuery);
    }

    bySpace(spaceId: SpaceSk) {
        return new ActivityQuery(this.qb.where({ spaceId }));
    }

    byUser(UserId: UserSk) {
        return new ActivityQuery(this.qb.where({ actorUserId: UserId }));
    }

    latest() {
        return new ActivityQuery(this.qb.orderBy("x.timestamp", "DESC"));
    }

    private joinIntactBySpace() {
        let query = this.qb
            .leftJoinAndSelect("x.actorUser", "actorUser")
            .leftJoinAndSelect("x.targetComment", "targetComment")
            .leftJoinAndSelect("x.targetContent", "targetContent");
        query = ContentQuery.joinRelated(query, "targetContent");
        return query;
    }

    private joinIntactByUser() {
        let query = this.qb
            .leftJoinAndSelect("x.space", "space")
            .leftJoinAndSelect("x.targetComment", "targetComment")
            .leftJoinAndSelect("x.targetContent", "targetContent");
        query = ContentQuery.joinRelated(query, "targetContent");
        return query;
    }

    async getManyBySpace(rep: ContentRepository, formatRep: FormatRepository) {
        const activities = await this.joinIntactBySpace().getMany();
        const rawContents = activities.map(x => x.targetContent).filter(notNull);
        const contents = await ContentQuery.makeRelatedMany(rawContents, Authority.READABLE, rep, formatRep);
        const contentMap = mapByString(contents, x => x.contentId);
        return activities.map(x => toIntactActivityBySpace(x, contentMap[x.targetContent?.entityId || ""]));
    }

    async getManyByUser(rep: ContentRepository, formatRep: FormatRepository) {
        const activities = await this.joinIntactByUser().getMany();
        const rawContents = activities.map(x => x.targetContent).filter(notNull);
        const contents = await ContentQuery.makeRelatedMany(rawContents, Authority.READABLE, rep, formatRep);
        const contentMap = mapByString(contents, x => x.contentId);
        return activities.map(x => toIntactActivityByUser(x, contentMap[x.targetContent?.entityId || ""]));
    }
}