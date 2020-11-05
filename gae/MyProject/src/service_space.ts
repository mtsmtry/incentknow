import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { FocusedSpace, FocusedSpaceMember, SpaceDisplayId, SpaceId, toFocusedSpace, toFocusedSpaceMember } from './utils_entities';
import { UtilsSpaceAuthorization } from './utils_authority';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;

export async function createSpace(args: { displayName: string, description: string }): Promise<FocusedSpace> {
    // get user　
    const user = await base.getMyUser();

    // create space
    let space = Space.new(user.id, args.displayName, args.description);
    space = await space.save();

    // join this space
    let member = SpaceMember.new(space.id, user.id, MemberType.OWNER);
    member = await member.save();
    return toFocusedSpace(space);
}

export async function getSpace(args: { spaceDisplayId: SpaceDisplayId }): Promise<FocusedSpace> {
    const [user, space] = await Promise.all([
        // get user
        base.getMyUser(),

        // get space
        base.conn.getRepository(Space)
            .createQueryBuilder("space")
            .leftJoinAndSelect("space.creatorUser", "creatorUser")
            .where("space.displayId = :displayId")
            .setParameters({ displayId: args.spaceDisplayId })
            .getOne()
    ]);

    await auth.checkSpaceAuth(user, space, SpaceAuth.VISIBLE);

    return toFocusedSpace(space);
}

export async function getSpaceMembers(args: { spaceId: SpaceId }): Promise<FocusedSpaceMember[]> {
    const [user, space, members] = await Promise.all([
        // get user
        base.getMyUser(),

        // get space for space.defaultAuthprity
        Space.findOne({ entityId: args.spaceId }),

        // get members
        SpaceMember
            .createQueryBuilder("member")
            .leftJoin("member.space", "space")
            .leftJoinAndSelect("member.user", "user")
            .where("space.entityId = :spaceId")
            .setParameters({ spaceId: args.spaceId })
            .getMany()
    ]);

    await auth.checkSpaceAuth(user, space, SpaceAuth.VISIBLE);
    return members.map(toFocusedSpaceMember);
}