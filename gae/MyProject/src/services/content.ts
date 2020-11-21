import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { IntactContainer, toFocusedContent, toIntactContainer, toFocusedFormatFromStructure, RelatedContent, SpaceId, FormatId } from './utils_entities';
import * as formatUtils from './utils_format';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;

export async function getContainers(displayId: string): Promise<IntactContainer[]> {
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

export async function getContents(args: { spaceId: SpaceId, formatId: FormatId }): Promise<RelatedContent[]> {

}