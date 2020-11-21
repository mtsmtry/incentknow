import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import * as base from './utils_base';
import { FocusedUser, IntactAccount, toFocusedUser, UserDisplayId, UserId } from "./utils_entities";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export async function createUser(email: string, displayName: string, password: string): Promise<FocusedUser> {
    let user = User.create({
        email: email,
        displayName: displayName,
        passwordHash: bcrypt.hashSync(password, 10)
    });

    user = await user.save();
    return toFocusedUser(user);
}

export async function getMyUser(): Promise<FocusedUser> {
    let user = await base.getMyUser();
    return toFocusedUser(user);
}

export async function getMyAccount(): Promise<IntactAccount> {
    let user = await base.getMyUser();
    return toFocusedUser(user);
}

export async function getUser(displayId: UserDisplayId): Promise<FocusedUser> {
    let user = await User.findOne({ displayId: displayId });
    return toFocusedUser(user);
}

const jwtSecret = "9099c62b375547b7b34a4485c033bd7eef28a26b928343cb9661da4dbf5482da";

export async function authenticate(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email: email });
    if (!bcrypt.compareSync(password, user.passwordHash)) {
        throw "Wrong password";
    }
    return jwt.sign(user.id.toString(), jwtSecret);
}

export function _verfyToken(token: string): number {
    return parseInt(jwt.verify(token, jwtSecret) as string);
}

export async function getFocusedUser(userId: UserId): Promise<FocusedUser> {
}

export async function getRelatedUser(userId: UserId): Promise<RelatedUser> {
}

export async function setMyDisplayName(displayName: string): Promise<{}> {
    await User.getRepository().update(base.userId, { displayName: displayName });
    return {};
}

export async function setMyDisplayId(displayId: UserDisplayId): Promise<{}> {
    await User.getRepository().update(base.userId, { displayId: displayId });
    return {};
}

export async function setMyPassword(
    oldPassword: string,
    newPassword: string
): Promise<{}> {
    
}

export async function setMyEmail(
    email: string
): Promise<{}> {
    
}

export async function setMyIcon(
    icon: string
): Promise<{}> {
    
}