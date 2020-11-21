import { MemberType, SpaceMember } from "../../entities/space/space_member";
import { RelatedUser, toRelatedUser } from "../user/user";

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