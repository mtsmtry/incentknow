import { Format, FormatId, FormatSk, FormatUsage } from "../../../entities/format/Format";
import { MetaProperty, MetaPropertyId, MetaPropertyType } from "../../../entities/format/MetaProperty";
import { Property, PropertyId, PropertySk } from "../../../entities/format/Property";
import { Structure, StructureSk } from "../../../entities/format/Structure";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { PropertyInfo, Type } from "../../../interfaces/format/Structure";
import { mapByString } from "../../../utils";
import { FormatQuery, FormatQueryFromEntity } from "../../queries/format/FormatQuery";
import { PropertyQuery } from "../../queries/format/PropertyQuery";
import { StructureQuery } from "../../queries/format/StructureQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class FormatRepository implements BaseRepository<FormatCommand> {
    constructor(
        private formats: Repository<Format>,
        private structures: Repository<Structure>,
        private props: Repository<Property>,
        private metaProps: Repository<MetaProperty>) {
    }

    fromFormats(trx?: Transaction) {
        return new FormatQuery(this.formats.createQuery(trx));
    }

    fromStructures(trx?: Transaction) {
        return new StructureQuery(this.structures.createQuery(trx));
    }

    fromProperty(trx?: Transaction) {
        return new PropertyQuery(this.props.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new FormatCommand(
            this.formats.createCommand(trx),
            this.structures.createCommand(trx),
            this.props.createCommand(trx),
            this.metaProps.createCommand(trx));
    }
}

export class FormatCommand implements BaseCommand {
    constructor(
        private formats: Command<Format>,
        private structures: Command<Structure>,
        private props: Command<Property>,
        private metaProps: Command<MetaProperty>) {
    }

    async _createProperty(formatId: number, parentPropertyId: number | null, order: number, info: PropertyInfo) {
        async function setTypeArguments(prop: Property, tyArgs: Type) {
            if (tyArgs.language) {
                prop.argLanguage = tyArgs.language;
            }
            if (tyArgs.subType) {
                prop.argType = tyArgs.subType.name;
            }
            if (tyArgs.format) {
                prop.argFormat = await this.formats.findOne({ entityId: tyArgs.format });
            }
        }

        async function setSubProperties(prop: Property, tyArgs: Type) {
            if (tyArgs.properties) {
                await Promise.all(tyArgs.properties.map((x, i) => this.createProperty(formatId, prop.id, i, x)));
            }
        }

        let prop = this.props.create({
            formatId,
            parentPropertyId: parentPropertyId,
            displayName: info.displayName,
            typeName: info.type.name,
            order: order,
            fieldName: info.fieldName,
            semantic: info.semantic,
            optional: info.optional
        });

        // set arguments
        await setTypeArguments(prop, info.type);
        if (info.type.subType) {
            await setTypeArguments(prop, info.type.subType);
        }

        // save
        prop = await this.props.save(prop);

        // set properties
        await setSubProperties(prop, info.type);
        if (info.type.subType) {
            await setSubProperties(prop, info.type.subType);
        }

        return prop;
    }

    async createFormat(userId: UserSk, spaceId: SpaceSk, displayName: string, description: string, usage: FormatUsage, properties: PropertyInfo[]) {
        const structureVersion = 1;

        // Format
        let format = this.formats.create({
            creatorUserId: userId,
            updaterUserId: userId,
            spaceId,
            displayName,
            description,
            latestVersion: structureVersion,
            usage
        });
        format = await this.formats.save(format);

        // Properties
        let props = await Promise.all(properties.map((x, i) => this._createProperty(format.id, null, i, x)));
        props = await this.props.save(props);

        // Structure
        let structure = this.structures.create({
            formatId: format.id,
            version: structureVersion,
            properties: props
        });
        structure = await this.structures.save(structure);

        // Format
        this.formats.update(format.id, { currentStructureId: structure.id });

        return new FormatQueryFromEntity(format);
    }

    async updateStructure(format: Format, properties: PropertyInfo[]) {

        const oldProps = format.properties.filter(x => properties.filter(y => x.entityId == y.id).length > 0);
        const oldProps2 = properties.filter(x => format.properties.filter(y => x.id == y.entityId).length > 0);
        const newProps = properties.filter(x => format.properties.filter(y => x.id == y.entityId).length == 0);

        // Update old properties
        const promises = oldProps2.map(async prop => {
            await this.props.update(prop.id, prop);
        });
        await Promise.all(promises);

        // Properties
        let savedNewProps = await Promise.all(newProps.map((x, i) => this._createProperty(format.id, null, i, x)));
        savedNewProps = await this.props.save(savedNewProps);

        // Structure
        let structure = this.structures.create({
            formatId: format.id,
            version: format.latestVersion + 1,
            properties: oldProps.concat(savedNewProps)
        });
        structure = await this.structures.save(structure);

        // Format
        this.formats.update(format.id, { currentStructureId: structure.id });
    }

    async addMetaProperty(propertyId: PropertySk, type: MetaPropertyType) {
        const metaProp = this.metaProps.create({
            propertyId,
            type
        });

        await this.metaProps.save(metaProp);
    }

    async removeMetaProperty(metaPropertyId: MetaPropertyId) {
        await this.metaProps.delete(metaPropertyId);
    }
}