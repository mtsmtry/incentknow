import { MembershipMethod, Space, SpaceAuthority } from "../../entities/space/Space";
import { Int } from "../../Implication";
import { RelatedContainer } from "../container/Container";
import { FocusedContent } from "../content/Content";
import { IntactActivityBySpace } from "../reactions/Activity";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { IntactSpaceMember } from "./SpaceMember";

export type SpaceId = string;

export type SpaceDisplayId = string;

export interface AdditionalSpaceInfo {
    containerCount: number;
    memberCount: number;
    formatCount: number;
};

export interface RelatedSpace {
    spaceId: SpaceId;
    displayId: SpaceDisplayId;
    displayName: string;
    description: string;
    createdAt: number;
    headerImage: string | null;
    published: boolean;
    membershipMethod: MembershipMethod;
    defaultAuthority: SpaceAuthority;
}

export function toRelatedSpace(space: Space): RelatedSpace {
    return {
        spaceId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        createdAt: toTimestamp(space.createdAt),
        headerImage: space.headerImage,
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
    headerImage: string | null;
    published: boolean;
    membershipMethod: MembershipMethod;
    defaultAuthority: SpaceAuthority;
    containerCount: Int;
    memberCount: Int;
    contentCount: Int;
    formatCount: Int;
    containers: RelatedContainer[];
}

export function toFocusedSpace(space: Space, additional: AdditionalSpaceInfo, containers: RelatedContainer[]): FocusedSpace {
    return {
        spaceId: space.entityId,
        displayId: space.displayId,
        displayName: space.displayName,
        description: space.description,
        creatorUser: toRelatedUser(space.creatorUser),
        createdAt: toTimestamp(space.createdAt),
        headerImage: space.headerImage,
        published: space.published,
        membershipMethod: space.membershipMethod,
        defaultAuthority: space.defaultAuthority,
        containerCount: additional.containerCount,
        memberCount: additional.memberCount,
        contentCount: containers.map(x => x.contentCount).reduce((x, y) => x + y, 0),
        formatCount: additional.formatCount,
        containers
    };
}

export interface IntactSpageHomePage {
    activities: IntactActivityBySpace[];
    topics: FocusedContent[];
    members: IntactSpaceMember[];
}