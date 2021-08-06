import { User } from "../../entities/user/User";
import { toTimestamp } from "../Utils";

export type UserId = string;

export type UserDisplayId = string;

export interface IntactAccount {
    userId: UserId;
    displayId: UserDisplayId;
    displayName: string;
    iconUrl: string | null;
    createdAt: number;
    email: string;
}

export function toIntactAccount(user: User): IntactAccount {
    return {
        userId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt),
        email: user.email
    }
}

export interface RelatedUser {
    userId: UserId;
    displayId: UserDisplayId;
    displayName: string;
    iconUrl: string | null;
    createdAt: number;
}

export function toRelatedUser(user: User): RelatedUser {
    return {
        userId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    }
}

export interface FocusedUser {
    userId: UserId;
    displayId: UserDisplayId;
    displayName: string;
    iconUrl: string | null;
    createdAt: number;
}

export function toFocusedUser(user: User): FocusedUser {
    return {
        userId: user.entityId,
        displayId: user.displayId,
        displayName: user.displayName,
        iconUrl: user.iconUrl,
        createdAt: toTimestamp(user.createdAt)
    }
}

export interface AuthInfo {
    session: string;
    userId: UserId;
}