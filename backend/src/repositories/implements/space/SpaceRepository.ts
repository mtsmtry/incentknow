import { MembershipMethod, Space, SpaceAuth, SpaceDisplayId, SpaceSk } from "../../../entities/space/Space";
import { SpaceFollow } from "../../../entities/space/SpaceFollow";
import { MemberType, SpaceMember } from "../../../entities/space/SpaceMember";
import { SpaceMembershipApplication, SpaceMembershipApplicationSk } from "../../../entities/space/SpaceMembershipApplication";
import { UserSk } from "../../../entities/user/User";
import { SpaceMemberQuery } from "../../queries/space/SpaceMemberQuery";
import { SpaceMemberApplicationQuery } from "../../queries/space/SpaceMembershipApplicationQuery";
import { SpaceQuery, SpaceQueryFromEntity } from "../../queries/space/SpaceQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class SpaceRepository implements BaseRepository<SpaceCommand> {
    constructor(
        private spaces: Repository<Space>,
        private members: Repository<SpaceMember>,
        private memberhipApps: Repository<SpaceMembershipApplication>,
        private follows: Repository<SpaceFollow>) {
    }

    fromSpaces(trx?: Transaction) {
        return new SpaceQuery(this.spaces.createQuery(trx));
    }

    fromMembers(trx?: Transaction) {
        return new SpaceMemberQuery(this.members.createQuery(trx));
    }

    fromMemberhipApplications(trx?: Transaction) {
        return new SpaceMemberApplicationQuery(this.memberhipApps.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new SpaceCommand(
            this.spaces.createCommand(trx),
            this.members.createCommand(trx),
            this.memberhipApps.createCommand(trx),
            this.follows.createCommand(trx));
    }
}

export class SpaceCommand implements BaseCommand {
    constructor(
        private spaces: Command<Space>,
        private members: Command<SpaceMember>,
        private membershipApps: Command<SpaceMembershipApplication>,
        private follows: Command<SpaceFollow>) {
    }

    async createSpace(userId: UserSk, displayId: string, displayName: string, description: string) {
        let space = this.spaces.create({
            creatorUserId: userId,
            displayId: displayId,
            displayName: displayName,
            description: description
        });
        space = await this.spaces.save(space);
        return new SpaceQueryFromEntity(space);
    }

    async addMember(spaceId: SpaceSk, userId: UserSk, type: MemberType) {
        let member = this.members.create({
            spaceId, userId, type
        });
        member = await this.members.save(member);
    }

    async setSpaceDisplayId(spaceId: SpaceSk, displayId: SpaceDisplayId) {
        await this.spaces.update(spaceId, { displayId });
    }

    async setSpaceDisplayName(spaceId: SpaceSk, displayName: string) {
        await this.spaces.update(spaceId, { displayName });
    }

    async setSpaceDefaultAuthority(spaceId: SpaceSk, defaultAuthority: SpaceAuth) {
        await this.spaces.update(spaceId, { defaultAuthority });
    }

    async setSpaceMembershipMethod(spaceId: SpaceSk, membershipMethod: MembershipMethod) {
        await this.spaces.update(spaceId, { membershipMethod });
    }

    async setSpacePublished(spaceId: SpaceSk, published: boolean) {
        await this.spaces.update(spaceId, { published });
    }

    async applySpaceMembership(spaceId: SpaceSk, userId: UserSk) {
        const member = this.membershipApps.create({
            spaceId, userId
        });
        await this.membershipApps.save(member);
    }

    async deleteMembershipApplication(appId: SpaceMembershipApplicationSk) {
        await this.membershipApps.delete(appId);
    }
}