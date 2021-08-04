import { MembershipMethod, SpaceAuth, SpaceDisplayId, SpaceId } from "../../entities/space/Space";
import { MemberType } from "../../entities/space/SpaceMember";
import { UserId } from "../../entities/user/User";
import { RelatedContainer } from "../../interfaces/container/Container";
import { FocusedSpace, RelatedSpace } from "../../interfaces/space/Space";
import { IntactSpaceMember } from "../../interfaces/space/SpaceMember";
import { IntactSpaceMembershipApplication } from "../../interfaces/space/SpaceMembershipApplication";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../../repositories/implements/space/SpaceRepository";
import { UserRepository } from "../../repositories/implements/user/UserDto";
import { BaseService } from "../BaseService";
import { LackOfAuthority } from "../Errors";
import { ServiceContext } from "../ServiceContext";

export class SpaceService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private spaces: SpaceRepository,
        private users: UserRepository,
        private auth: AuthorityRepository,
        private con: ContainerRepository) {
        super(ctx);
    }

    async createSpace(displayId: string, displayName: string, description: string): Promise<SpaceDisplayId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const space = await this.spaces.createCommand(trx).createSpace(userId, displayId, displayName, description);
            await this.spaces.createCommand(trx).addMember(space.raw.id, userId, MemberType.OWNER);
            return space.raw.displayId;
        });
    }

    async getSpace(spaceDisplayId: SpaceDisplayId): Promise<FocusedSpace> {
        const userId = this.ctx.getAuthorized();
        const [space, spaceRaw] = await this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectFocused().getNeededOneWithRaw();
        const auth = await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.VISIBLE, userId, spaceRaw);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return space;
    }

    async getMySpaces(): Promise<RelatedSpace[]> {
        const userId = this.ctx.getAuthorized();
        return await this.spaces.fromMembers().byUser(userId).selectRelatedSpace().getMany();
    }

    async getRelatedSpace(spaceId: SpaceId): Promise<RelatedSpace> {
        const userId = this.ctx.getAuthorized();
        const [space, spaceRaw] = await this.spaces.fromSpaces().byEntityId(spaceId).selectRelated().getNeededOneWithRaw();
        const auth = await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.VISIBLE, userId, spaceRaw);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return space;
    }

    async getSpaceMembers(spaceId: SpaceId): Promise<IntactSpaceMember[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.spaces.fromMembers().bySpace(space.id).selectIntact().getMany();
    }

    async getSpaceMembershipApplications(spaceId: SpaceId): Promise<IntactSpaceMembershipApplication[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.spaces.fromMemberhipApplications().bySpace(space.id).selectIntact().getMany();
    }

    async getAvailableSpaceDisplayId(spaceDisplayId: SpaceDisplayId): Promise<boolean> {
        const spaces = await this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectId().getMany();
        return spaces.length == 0;
    }

    async getFollowingSpaces(): Promise<FocusedSpace[]> {
        const userId = this.ctx.getAuthorized();
        return await this.spaces.fromSpaces().byFollower(userId).selectFocused().getMany();
    }

    async getPublishedSpaces(): Promise<FocusedSpace[]> {
        return await this.spaces.fromSpaces().byPublished().selectFocused().getMany();
    }

    async applySpaceMembership(spaceId: SpaceId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const space = await this.spaces.fromSpaces(trx).byEntityId(spaceId).getNeededOne();
            await this.spaces.createCommand(trx).applySpaceMembership(space.id, userId);
            return {};
        });
    }

    async acceptSpaceMembership(spaceId: SpaceId, targetUserId: UserId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            const targetUser = await this.users.fromUsers(trx).byEntityId(targetUserId).getNeededOne();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(targetUser.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            await this.spaces.createCommand(trx).addMember(space.id, targetUser.id, MemberType.NORMAL);
            return {};
        });
    }

    async rejectSpaceMembership(spaceId: SpaceId, targetUserId: UserId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            const user = await this.users.fromUsers(trx).byEntityId(targetUserId).getNeededOne();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(user.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            return {};
        });
    }

    async cancelSpaceMembershipApplication(spaceId: SpaceId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(userId).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            return {};
        });
    }

    async setSpaceMembershipMethod(spaceId: SpaceId, membershipMethod: MembershipMethod): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.spaces.createCommand(trx).setSpaceMembershipMethod(space.id, membershipMethod);
            return {};
        });
    }

    async setSpaceDisplayName(spaceId: SpaceId, displayName: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.spaces.createCommand(trx).setSpaceDisplayName(space.id, displayName);
            return {};
        });
    }

    async setSpaceDisplayId(spaceId: SpaceId, displayId: SpaceDisplayId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.spaces.createCommand(trx).setSpaceDisplayId(space.id, displayId);
            return {};
        });
    }

    async setSpacePublished(spaceId: SpaceId, published: boolean): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.spaces.createCommand(trx).setSpacePublished(space.id, published);
            return {};
        });
    }

    async setSpaceDefaultAuthority(spaceId: SpaceId, defaultAuthority: SpaceAuth): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.spaces.createCommand(trx).setSpaceDefaultAuthority(space.id, defaultAuthority);
            return {};
        });
    }

    async getSpaceContainers(spaceId: SpaceId): Promise<RelatedContainer[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.READABLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.con.fromContainers().bySpace(space.id).selectRelated().getMany();
    }
}