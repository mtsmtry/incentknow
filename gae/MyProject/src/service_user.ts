import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { FocusedUser, toFocusedUser, UserDisplayId } from "./utils_entities";

const base = UtilsBase;


export async function createUser(args: { email: string, displayName: string, password: string }): Promise<FocusedUser> {
    let user = User.new(args.email, args.displayName, args.password);
    user = await user.save();
    return toFocusedUser(user);
}

export async function getMyUser(args: {}): Promise<FocusedUser> {
    let user = await User.findOne({ entityId: base.userId });
    return toFocusedUser(user);
}

export async function getUser(args: { displayId: UserDisplayId }): Promise<FocusedUser> {
    let user = await User.findOne({ displayId: args.displayId });
    return toFocusedUser(user);
}

export async function setMyDisplayName(args: { displayName: string }): Promise<{}> {
    await User.getRepository().update({ entityId: base.userId }, { displayName: args.displayName });
    return {};
}

export async function setMyDisplayId(args: { displayId: UserDisplayId }): Promise<{}> {
    await User.getRepository().update({ entityId: base.userId }, { displayId: args.displayId });
    return {};
}
