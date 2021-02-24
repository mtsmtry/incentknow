import { SpaceMembershipApplication } from "../../entities/space/SpaceMembershipApplication";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export interface IntactSpaceMembershipApplication {
    user: RelatedUser;
    appliedAt: number;
}

export function toIntactSpaceMembershipApplication(app: SpaceMembershipApplication): IntactSpaceMembershipApplication {
    return {
        user: toRelatedUser(app.user),
        appliedAt: toTimestamp(app.appliedAt)
    }
}