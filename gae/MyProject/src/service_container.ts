import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { MongoClient } from './client_mongodb';
import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { IntactContainer, toFocusedContent, toIntactContainer, toFocusedFormatFromStructure } from './utils_entities';
import { UtilsFormat } from './utils_format';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;
const formatUtils = UtilsFormat;

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