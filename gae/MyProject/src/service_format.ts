import { AnyARecord } from 'dns';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';
import { isString } from 'util';
import { MongoClient } from './client_mongodb';
import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { UtilsBase } from './utils_base';
import { UtilsSpaceAuthorization } from './utils_authority';
import { FocusedFormat, RelatedFormat, FormatDisplayId, PropertyInfo, toFocusedFormat, toRelatedFormat, toFocusedFormatFromStructure, TypeArguments, SpaceId } from './utils_entities';
import { UtilsFormat } from './utils_format';

const base = UtilsBase;
const auth = UtilsSpaceAuthorization;
const formatUtils = UtilsFormat;

async function _createProperty(formatId: number, parentPropertyId: number | null, order: number, info: PropertyInfo) {
    async function setTypeArguments(prop: Property, tyArgs: TypeArguments) {
        if (tyArgs.language) {
            prop.argLanguage = tyArgs.language;
        }
        if (tyArgs.type) {
            prop.argType = tyArgs.type.name;
        }
        if (tyArgs.format) {
            prop.argFormat = await Format.findOne({ entityId: tyArgs.format });
        }
    }

    async function setSubProperties(prop: Property, tyArgs: TypeArguments) {
        if (tyArgs.properties) {
            await Promise.all(tyArgs.properties.map((x, i) => this.createProperty(formatId, prop.id, i, x)));
        }
    }

    let prop = Property.new(formatId, parentPropertyId, info.id, info.displayName, info.type.name, order);
    prop.fieldName = info.fieldName;
    prop.semantic = info.semantic;
    prop.optional = info.optional;

    // set arguments
    await setTypeArguments(prop, info.type.arguments);
    if (info.type.arguments.type) {
        await setTypeArguments(prop, info.type.arguments.type.arguments);
    }

    // save
    prop = await prop.save();

    // set properties
    await setSubProperties(prop, info.type.arguments);
    if (info.type.arguments.type) {
        await setSubProperties(prop, info.type.arguments.type.arguments);
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

export async function getFormat(args: { formatDisplayId: FormatDisplayId }): Promise<FocusedFormat> {
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