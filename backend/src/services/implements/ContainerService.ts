import { SpaceAuth, SpaceId } from "../../entities/space/Space";
import { RelatedContainer } from "../../interfaces/container/Container";
import { ContainerRepository } from "../../repositories/implements/container/ContainerRepository";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
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

    async getContainers(spaceId: SpaceId): Promise<RelatedContainer[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        if (!auth) {
            throw new LackOfAuthority();
        }
        return await this.containers.fromContainers().bySpace(space.id).selectRelated().getMany();
    }
}