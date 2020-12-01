import { MembershipMethod, SpaceAuth, SpaceDisplayId, SpaceId } from "../../entities/space/space";
import { MemberType } from "../../entities/space/space_member";
import { UserId } from "../../entities/user/user";
import { FocusedSpace, RelatedSpace } from "../../interfaces/space/space";
import { IntactSpaceMember } from "../../interfaces/space/space_member";
import { IntactSpaceMembershipApplication } from "../../interfaces/space/space_membership_application";
import { AuthorityRepository } from "../../repositories/implements/space/authority";
import { SpaceRepository } from "../../repositories/implements/space/space";
import { UserRepository } from "../../repositories/implements/user/user";
import { AuthenticatedService } from "../authenticated_service";

export class SpaceService extends AuthenticatedService {
    constructor(
        private spaces: SpaceRepository,
        private users: UserRepository,
        private auth: AuthorityRepository) {
        super();
    }

    async createSpace(displayId: string, displayName: string, description: string): Promise<SpaceId> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const space = await this.spaces.createCommand(trx).createSpace(userId, displayId, displayName, description);
            await this.spaces.createCommand(trx).addMember(space.raw.id, userId, MemberType.OWNER);
            return space.raw.entityId;
        });
    }

    async getSpace(spaceDisplayId: SpaceDisplayId): Promise<FocusedSpace> {
        const userId = this.getAuthorized();
        const [space, spaceRaw] = await this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectFocused().getNeededOneWithRaw();
        const auth = await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.VISIBLE, userId, spaceRaw);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return space;
    }

    async getRelatedSpace(spaceId: SpaceId): Promise<RelatedSpace> {
        const userId = this.getAuthorized();
        const [space, spaceRaw] = await this.spaces.fromSpaces().byEntityId(spaceId).selectRelated().getNeededOneWithRaw();
        const auth = await this.auth.fromAuths().getSpaceAuthByEntity(SpaceAuth.VISIBLE, userId, spaceRaw);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return space;
    }

    async getSpaceMembers(spaceId: SpaceId): Promise<IntactSpaceMember[]> {
        const userId = this.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.spaces.fromMembers().bySpace(space.id).selectIntact().getMany();
    }

    async getSpaceMembershipApplications(spaceId: SpaceId): Promise<IntactSpaceMembershipApplication[]> {
        const userId = this.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.spaces.fromMemberhipApplications().bySpace(space.id).selectIntact().getMany();
    }

    async getAvailableSpaceDisplayId(spaceDisplayId: SpaceDisplayId) {
        const spaces = await this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectId().getMany();
        return spaces.length == 0;
    }

    async getFollowingSpaces(): Promise<RelatedSpace[]> {
        const userId = this.getAuthorized();
        return await this.spaces.fromSpaces().byFollower(userId).selectRelated().getMany();
    }

    async getPublishedSpaces(): Promise<RelatedSpace[]> {
        return await this.spaces.fromSpaces().byPublished().selectRelated().getMany();
    }

    async acceptSpaceMembership(spaceId: SpaceId, targetUserId: UserId) {
        return await this.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            const user = await this.getMyUser();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(user.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            await this.spaces.createCommand(trx).addMember(space.id, userId, MemberType.NORMAL);
        });
    }

    async rejectSpaceMembership(spaceId: SpaceId, targetUserId: UserId) {
        return await this.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            const user = await this.users.fromUsers(trx).byEntityId(targetUserId).getNeededOne();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(user.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
        });
    }

    async cancelSpaceMembershipApplication(spaceId: SpaceId) {
        return await this.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            const user = await this.getMyUser();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(user.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
        });
    }

    async setSpaceMembershipMethod(spaceId: SpaceId, membershipMethod: MembershipMethod) {
        return await this.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.spaces.createCommand(trx).setSpaceMembershipMethod(space.id, membershipMethod);
        });
    }
}