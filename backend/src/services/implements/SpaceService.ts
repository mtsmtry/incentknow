import * as fs from "fs";
import * as sharp from "sharp";
import * as uuid from "uuid";
import { MembershipMethod, SpaceAuthority, SpaceDisplayId, SpaceId } from "../../entities/space/Space";
import { MemberType } from "../../entities/space/SpaceMember";
import { UserId } from "../../entities/user/User";
import { Blob } from "../../Implication";
import { RelatedContainer } from "../../interfaces/container/Container";
import { FocusedSpace, IntactSpageHomePage, RelatedSpace } from "../../interfaces/space/Space";
import { IntactSpaceMember } from "../../interfaces/space/SpaceMember";
import { IntactSpaceMembershipApplication } from "../../interfaces/space/SpaceMembershipApplication";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { ContentRepository } from "../../repositories/implements/content/ContentRepository.";
import { FormatRepository } from "../../repositories/implements/format/FormatRepository";
import { ActivityRepository } from "../../repositories/implements/reactions/ActivityRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../../repositories/implements/space/SpaceRepository";
import { UserRepository } from "../../repositories/implements/user/UserRepository";
import { checkSpaceAuthority, getAuthority } from "../../repositories/queries/space/AuthorityQuery";
import { notNull } from "../../Utils";
import { BaseService } from "../BaseService";
import { ServiceContext } from "../ServiceContext";

export class SpaceService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private spaces: SpaceRepository,
        private users: UserRepository,
        private auth: AuthorityRepository,
        private con: ContainerRepository,
        private content: ContentRepository,
        private format: FormatRepository,
        private act: ActivityRepository) {
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
        const [getSpace, spaceRaw] = await this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectFocused().getNeededOneWithRaw();

        const [auth] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceRaw.id);
        checkSpaceAuthority(auth, SpaceAuthority.VISIBLE);

        const containers = await this.con.fromContainers().bySpace(spaceRaw.id).selectRelated().getMany();
        return getSpace(containers);
    }

    async getRelatedSpace(spaceId: SpaceId): Promise<RelatedSpace> {
        const userId = this.ctx.getAuthorized();
        const [space, spaceRaw] = await this.spaces.fromSpaces().byEntityId(spaceId).selectRelated().getNeededOneWithRaw();

        const [auth] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceRaw.id);
        checkSpaceAuthority(auth, SpaceAuthority.VISIBLE);

        return space;
    }

    async getSpaceMembers(spaceId: SpaceId): Promise<IntactSpaceMember[]> {
        const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
        checkSpaceAuthority(auth, SpaceAuthority.READABLE);
        return await this.spaces.fromMembers().bySpace(space.id).selectIntact().getMany();
    }

    async getSpaceMembershipApplications(spaceId: SpaceId): Promise<IntactSpaceMembershipApplication[]> {
        const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
        checkSpaceAuthority(auth, SpaceAuthority.VISIBLE);
        return await this.spaces.fromMemberhipApplications().bySpace(space.id).selectIntact().getMany();
    }

    async getAvailableSpaceDisplayId(spaceDisplayId: SpaceDisplayId): Promise<boolean> {
        const spaces = await this.spaces.fromSpaces().byDisplayId(spaceDisplayId).selectId().getMany();
        return spaces.length == 0;
    }

    async getCandidateSpaces(): Promise<RelatedSpace[]> {
        const userId = this.ctx.getAuthorized();
        return await this.spaces.fromSpaces().byMember(userId).selectRelated().getMany();
    }

    async getMySpaces(): Promise<RelatedSpace[]> {
        const userId = this.ctx.getAuthorized();
        return await this.spaces.fromSpaces().byMember(userId).selectRelated().getMany();
    }

    async getFollowingSpaces(): Promise<RelatedSpace[]> {
        const userId = this.ctx.getAuthorized();
        return await this.spaces.fromSpaces().byFollower(userId).selectRelated().getMany();
    }

    async getPublishedSpaces(): Promise<RelatedSpace[]> {
        return await this.spaces.fromSpaces().byPublished().selectRelated().getMany();
    }

    async applySpaceMembership(spaceId: SpaceId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.VISIBLE);

            await this.spaces.createCommand(trx).applySpaceMembership(space.id, userId);
            return {};
        });
    }

    async acceptSpaceMembership(spaceId: SpaceId, targetUserId: UserId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            const targetUser = await this.users.fromUsers(trx).byEntityId(targetUserId).getNeededOne();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(targetUser.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            await this.spaces.createCommand(trx).addMember(space.id, targetUser.id, MemberType.NORMAL);
            return {};
        });
    }

    async rejectSpaceMembership(spaceId: SpaceId, targetUserId: UserId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            const user = await this.users.fromUsers(trx).byEntityId(targetUserId).getNeededOne();
            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(user.id).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            return {};
        });
    }

    async cancelSpaceMembershipApplication(spaceId: SpaceId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            const app = await this.spaces.fromMemberhipApplications(trx).bySpace(space.id).byUser(userId).getNeededOne();
            await this.spaces.createCommand(trx).deleteMembershipApplication(app.id);
            return {};
        });
    }

    async setSpaceMembershipMethod(spaceId: SpaceId, membershipMethod: MembershipMethod): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            await this.spaces.createCommand(trx).setSpaceMembershipMethod(space.id, membershipMethod);
            return {};
        });
    }

    async setSpaceDisplayName(spaceId: SpaceId, displayName: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            await this.spaces.createCommand(trx).setSpaceDisplayName(space.id, displayName);
            return {};
        });
    }

    async setSpaceDescription(spaceId: SpaceId, description: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            await this.spaces.createCommand(trx).setSpaceDescription(space.id, description);
            return {};
        });
    }

    async uploadSpaceHeaderImage(args: { spaceId: SpaceId, blob: Blob }): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(userId, args.spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            if (space.headerImage) {
                fs.unlinkSync("public/uploaded/" + space.headerImage + ".jpg");
                fs.unlinkSync("public/uploaded/" + space.headerImage + ".full.jpg");
            }

            const filename = uuid.v4();
            sharp(args.blob.buffer)
                .resize({
                    width: 600,
                    height: 200,
                    fit: sharp.fit.cover,
                    position: sharp.gravity.center
                })
                .jpeg()
                .toFile("public/uploaded/" + filename + ".jpg");
            sharp(args.blob.buffer)
                .resize({
                    width: 1800,
                    height: 400,
                    fit: sharp.fit.cover,
                    position: sharp.gravity.center
                })
                .jpeg()
                .toFile("public/uploaded/" + filename + ".full.jpg");

            await this.spaces.createCommand(trx).setSpaceHeaderImage(space.id, filename);
            return {};
        });
    }

    async setSpaceDisplayId(spaceId: SpaceId, displayId: SpaceDisplayId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            await this.spaces.createCommand(trx).setSpaceDisplayId(space.id, displayId);
            return {};
        });
    }

    async setSpacePublished(spaceId: SpaceId, published: boolean): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            await this.spaces.createCommand(trx).setSpacePublished(space.id, published);
            return {};
        });
    }

    async setSpaceDefaultAuthority(spaceId: SpaceId, defaultAuthority: SpaceAuthority): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
            checkSpaceAuthority(auth, SpaceAuthority.WRITABLE);

            await this.spaces.createCommand(trx).setSpaceDefaultAuthority(space.id, defaultAuthority);
            return {};
        });
    }

    async getSpaceContainers(spaceId: SpaceId): Promise<RelatedContainer[]> {
        const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
        checkSpaceAuthority(auth, SpaceAuthority.READABLE);

        return await this.con.fromContainers().bySpace(space.id).selectRelated().getMany();
    }

    async getSpaceHomePage(spaceId: SpaceId): Promise<IntactSpageHomePage> {
        // await sleep(1000 * 3600);

        const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
        checkSpaceAuthority(auth, SpaceAuthority.READABLE);

        const getTopics = async () => {
            const containers = await this.con.fromContainers().bySpace(space.id).getMany();
            const promises = containers.map(x => this.content.fromContents().byContainer(x.id).mostViewed().limit(1).getFocusedMany(this.content, this.format, getAuthority(auth)));
            return Promise.all(promises);
        };
        const [topics, activities, members] = await Promise.all([
            getTopics(),
            this.act.fromActivities().bySpace(space.id).latest().limit(5).getManyBySpace(this.content, this.format),
            this.spaces.fromMembers().bySpace(space.id).selectIntact().getMany()
        ]);
        return {
            topics: topics.filter(notNull).filter(x => x.length > 0).map(x => x[0].content),
            activities,
            members
        };
    }
}