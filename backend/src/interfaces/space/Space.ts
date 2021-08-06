import { MembershipMethod, Space, SpaceAuth } from "../../entities/space/Space";
import { Int } from "../../Implication";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export type SpaceId = string;

export type SpaceDisplayId = string;

export interface AdditionalSpaceInfo {
    containerCount: Int;
    memberCount: number;
    contentCount: number;
    formatCount: number;
};

export interface RelatedSpace {
    spaceId: SpaceId;
    displayId: SpaceDisplayId;
    displayName: string;
    description: string;
    createdAt: number;
    homeUrl: string | null;
    published: boolean;
    membershipMethod: MembershipMethod;
    defaultAuthority: SpaceAuth;
}

export function toRelatedSpace(space: Space): RelatedSpace {
    return {
        spaceId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        published: space.published,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority
    };
}

export interface FocusedSpace {
    spaceId: SpaceId;
    displayId: SpaceDisplayId;
    displayName: string;
    description: string;
    creatorUser: RelatedUser,
    createdAt: number;
    homeUrl: string | null;
    published: boolean;
    membershipMethod: MembershipMethod;
    defaultAuthority: SpaceAuth;
    containerCount: Int;
    memberCount: Int;
    contentCount: Int;
    formatCount: Int;
}

export function toFocusedSpace(space: Space, additional: AdditionalSpaceInfo): FocusedSpace {
    return {
        spaceId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        creatorUser: toRelatedUser(space.creatorUser),
        createdAt: toTimestamp(space.createdAt),
        homeUrl: space.homeUrl,
        published: space.published,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority,
        containerCount: additional.containerCount,
        memberCount: additional.memberCount,
        contentCount: additional.contentCount,
        formatCount: additional.formatCount
    };
}