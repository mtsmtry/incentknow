import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { FocusedFormat, RelatedFormat, FormatDisplayId, PropertyInfo, toFocusedFormat, toRelatedFormat, toFocusedFormatFromStructure, SpaceId, Type, FormatId } from './utils_entities';
import * as formatUtils from './utils_format';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;

async function _createProperty(formatId: number, parentPropertyId: number | null, order: number, info: PropertyInfo) {
    async function setTypeArguments(prop: Property, tyArgs: Type) {
        if (tyArgs.language) {
            prop.argLanguage = tyArgs.language;
        }
        if (tyArgs.subType) {
            prop.argType = tyArgs.subType.name;
        }
        if (tyArgs.format) {
            prop.argFormat = await Format.findOne({ entityId: tyArgs.format });
        }
    }

    async function setSubProperties(prop: Property, tyArgs: Type) {
        if (tyArgs.properties) {
            await Promise.all(tyArgs.properties.map((x, i) => this.createProperty(formatId, prop.id, i, x)));
        }
    }

    let prop = Property.new(formatId, parentPropertyId, info.id, info.displayName, info.type.name, order);
    prop.fieldName = info.fieldName;
    prop.semantic = info.semantic;
    prop.optional = info.optional;

    // set arguments
    await setTypeArguments(prop, info.type);
    if (info.type.subType) {
        await setTypeArguments(prop, info.type.subType);
    }

    // save
    prop = await prop.save();

    // set properties
    await setSubProperties(prop, info.type);
    if (info.type.subType) {
        await setSubProperties(prop, info.type.subType);
    }

    return prop;
}

export async function createFormat(args: {
    spaceId: SpaceId,
    displayName: string,
    description: string,
    usage: FormatUsage,
    properties: PropertyInfo[]
}): Promise<RelatedFormat> {
    // get user and space
    const user = await base.getMyUser();
    const space = await Space.findOne({ entityId: args.spaceId });

    await auth.checkSpaceAuth(user, space, SpaceAuth.WRITABLE);

    // create format
    let format = Format.new(user.id, space.id, args.displayName, args.description, args.usage);
    format = await format.save();

    // create properties
    let props = await Promise.all(args.properties.map((x, i) => this._createProperty(format.id, null, i, x)));
    props = await Property.save(props);

    // create structure
    let structure = Structure.new(format.id, props);
    structure = await structure.save();

    // set format.currentStructure
    await Format.update(format.id, { currentStructure: Structure.create({ id: structure.id }) });

    return toRelatedFormat(format);
}

export async function getFormat(args: {
    formatDisplayId: FormatDisplayId
}): Promise<FocusedFormat> {
    // create format
    const format = await
        formatUtils.joinProperties(Format
            .createQueryBuilder("format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            .leftJoinAndSelect("format.currentStructure", "currentStructure")
            , "currentStructure")
            .where("format.displayId = :displayId")
            .setParameters({ displayId: args.formatDisplayId })
            .getOne();

    // check authority
    const user = await base.getMyUser();
    await auth.checkSpaceAuth(user, format.space, SpaceAuth.READABLE);

    return toFocusedFormat(format);
}

export async function getFocusedFormat(args: {
    formatId: FormatId
}): Promise<FocusedFormat> {
    // create format
    const format = await
        formatUtils.joinProperties(Format
            .createQueryBuilder("format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            .leftJoinAndSelect("format.currentStructure", "currentStructure")
            , "currentStructure")
            .where("format.entityId = :entityId")
            .setParameters({ entityId: args.formatId })
            .getOne();

    // check authority
    const user = await base.getMyUser();
    await auth.checkSpaceAuth(user, format.space, SpaceAuth.READABLE);

    return toFocusedFormat(format);
}

export async function getRelatedFormat(args: {
    formatId: FormatId
}): Promise<RelatedFormat> {
    // create format
    const format = await
        formatUtils.joinProperties(Format
            .createQueryBuilder("format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            , "currentStructure")
            .where("format.entityId = :entityId")
            .setParameters({ entityId: args.formatId })
            .getOne();

    // check authority
    const user = await base.getMyUser();
    await auth.checkSpaceAuth(user, format.space, SpaceAuth.READABLE);

    return toRelatedFormat(format);
}

export async function getFormats(args: {
    spaceId: SpaceId
}): Promise<RelatedFormat[]> {

    // get space
    const space = Space.findOne({ entityId: args.spaceId });

    // create format
    const formats = await
        formatUtils.joinProperties(Format
            .createQueryBuilder("format")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser")
            , "currentStructure")
            .where("format.space = :space")
            .setParameters({ space })
            .getMany();

    // check authority
    //const user = await base.getMyUser();
    //await auth.checkSpaceAuth(user, format.space, SpaceAuth.READABLE);

    return formats.map(toRelatedFormat)
}

export async function updateFormatStructure(args: {
    formatId: FormatId,
    properties: PropertyInfo[]
}): Promise<{}> {

}