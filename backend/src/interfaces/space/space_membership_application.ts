import { SpaceMembershipApplication } from "../../entities/space/space_membership_application";
import { RelatedUser, toRelatedUser } from "../user/user";

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