import { SpaceAuthority, SpaceId } from "../../entities/space/Space";
import { FocusedContainer } from "../../interfaces/container/Container";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { checkSpaceAuthority } from "../../repositories/queries/space/AuthorityQuery";
import { BaseService } from "../BaseService";
import { LackOfAuthority } from "../Errors";
import { ServiceContext } from "../ServiceContext";

export class ContainerService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private containers: ContainerRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    async getContainers(spaceId: SpaceId): Promise<FocusedContainer[]> {
        const [auth, space] = await this.auth.fromAuths().getSpaceAuthority(this.ctx.userId, spaceId);
        checkSpaceAuthority(auth, SpaceAuthority.VISIBLE);
        return await this.containers.fromContainers().bySpace(space.id).selectFocused().getMany();
    }
}