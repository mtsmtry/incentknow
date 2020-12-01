import { AuthenticatedService } from "../authenticated_service";

class ContentService extends AuthenticatedService {
    async function getContainers(displayId: string): Promise<IntactContainer[]> {
        const containers = await Container
            .createQueryBuilder("container")
            .leftJoin("container.space", "space")
            .leftJoinAndSelect("container.format", "format")
            .where("space.displayId = :displayId")
            .setParameters({ displayId })
            .getMany();
    
        // check authority
        const user = await base.getMyUser();
        let space = null;
        if (containers.length == 0) {
            space = await Space.findOne({ displayId: displayId });
        } else {
            space = containers[0].space;
        }
        await auth.checkSpaceAuth(user, space, SpaceAuth.READABLE);
    
        return containers.map(toIntactContainer);
    }
    
    async function getContents(spaceId: SpaceId, formatId: FormatId): Promise<RelatedContent[]> {
    
    }
}
