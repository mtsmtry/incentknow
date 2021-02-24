import { MemberType, SpaceMember } from "../../entities/space/SpaceMember";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export interface IntactSpaceMember {
    user: RelatedUser;
    joinedAt: number;
    type: MemberType;
}

export function toIntactSpaceMember(member: SpaceMember): IntactSpaceMember {
    return {
        user: toRelatedUser(member.user),
        joinedAt: toTimestamp(member.joinedAt),
        type: member.type
    }
}