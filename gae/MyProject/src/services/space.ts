import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { FocusedSpace, IntactSpaceMember, IntactSpaceMembershipApplication, RelatedSpace, SpaceDisplayId, SpaceId, toFocusedSpace, toIntactSpaceMember, UserId } from './utils_entities';
import { UtilsSpaceAuthorization } from './utils_authority';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;

export async function createSpace(
    displayId: string,
    displayName: string,
    description: string
): Promise<FocusedSpace> {
    // get user　
    const user = await base.getMyUser();

    // create space
    let space = Space.create({
        creatorUser: User.create({ id: user.id }),
        displayId: displayId,
        displayName: displayName,
        description: description
    });
    space = await space.save();

    // join this space
    let member = SpaceMember.new(space.id, user.id, MemberType.OWNER);
    member = await member.save();
    return toFocusedSpace(space);
}

export async function getSpace(
    spaceDisplayId: SpaceDisplayId
): Promise<FocusedSpace> {
    const [user, space] = await Promise.all([
        // get user
        base.getMyUser(),

        // get space
        base.conn.getRepository(Space)
            .createQueryBuilder("space")
            .leftJoinAndSelect("space.creatorUser", "creatorUser")
            .where("space.displayId = :displayId")
            .setParameters({ displayId: spaceDisplayId })
            .getOne()
    ]);

    await auth.checkSpaceAuth(user, space, SpaceAuth.VISIBLE);

    return toFocusedSpace(space);
}

export async function getRelatedSpace(
    spaceId: SpaceId
): Promise<RelatedSpace> {

}

export async function getSpaceMembers(
    spaceId: SpaceId
): Promise<IntactSpaceMember[]> {
    const [user, space, members] = await Promise.all([
        // get user
        base.getMyUser(),

        // get space for space.defaultAuthprity
        Space.findOne({ entityId: spaceId }),

        // get members
        SpaceMember
            .createQueryBuilder("member")
            .leftJoin("member.space", "space")
            .leftJoinAndSelect("member.user", "user")
            .where("space.entityId = :spaceId")
            .setParameters({ spaceId: spaceId })
            .getMany()
    ]);

    await auth.checkSpaceAuth(user, space, SpaceAuth.VISIBLE);
    return members.map(toIntactSpaceMember);
}

export async function getSpaceMembershipApplications(
    space: SpaceId
): Promise<IntactSpaceMembershipApplication[]> {

}

export async function checkSpaceDisplayId(
    spaceDisplayId: SpaceDisplayId
): Promise<boolean> {

    const space = await Space.findOne({ displayId: spaceDisplayId });
    if (!space) {
        return false;
    }
    return true;
}

export async function getMySpaces(args: {}): Promise<RelatedSpace[]> {
    return [];
}

export async function getPublishedSpaces(args: {}): Promise<RelatedSpace[]> {
    return [];
}

export async function setSpaceDisplayId(
    spaceId: SpaceId,
    spaceDisplayId: SpaceDisplayId
): Promise<{}> {
    return {};
}

export async function setSpaceDisplayName(
    spaceId: SpaceId,
    displayName: string
): Promise<{}> {
    return {};
}

export async function setSpaceAuthority(
    spaceId: SpaceId,
    auth: SpaceAuth
): Promise<{}> {
    return {};
}

export async function setSpacePublished(
    spaceId: SpaceId,
    published: boolean
): Promise<{}> {
    return {};
}

export async function applySpaceMembership(
    spaceId: SpaceId
): Promise<{}> {
    return {};
}

export async function acceptSpaceMembership(
    spaceId: SpaceId,
    userId: UserId
): Promise<{}> {
    return {};
}

export async function rejectSpaceMembership(
    spaceId: SpaceId,
    userId: UserId
): Promise<{}> {
    return {};
}

export async function cancelSpaceMembershipApplication(
    spaceId: SpaceId
): Promise<{}> {
    return {};
}

export async function setSpaceMembershipMethod(
    spaceId: SpaceId,
    membershipMethod: MembershipMethod
): Promise<{}> {
    return {};
}