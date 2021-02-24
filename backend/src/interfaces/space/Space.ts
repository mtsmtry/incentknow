import { MembershipMethod, Space, SpaceAuth } from "../../entities/space/Space";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";

export type SpaceId = string;

export type SpaceDisplayId = string;

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
}

export function toFocusedSpace(space: Space): FocusedSpace {
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
        defaultAuthority: space.defaultAuthority
    };
}