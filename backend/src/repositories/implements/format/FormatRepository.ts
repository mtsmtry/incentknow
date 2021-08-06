import { Content } from "../../../entities/content/Content";
import { Format, FormatDisplayId, FormatSk, FormatUsage } from "../../../entities/format/Format";
import { MetaProperty, MetaPropertyId, MetaPropertyType } from "../../../entities/format/MetaProperty";
import { Property, PropertySk } from "../../../entities/format/Property";
import { Structure } from "../../../entities/format/Structure";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { Relation } from "../../../interfaces/format/Format";
import { PropertyInfo, toPropertyInfo, Type } from "../../../interfaces/format/Structure";
import { FormatQuery, FormatQueryFromEntity } from "../../queries/format/FormatQuery";
import { PropertyQuery } from "../../queries/format/PropertyQuery";
import { joinPropertyArguments, StructureQuery } from "../../queries/format/StructureQuery";
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

    async getRelations(formatId: FormatSk) {
        let qb = this.props.createQuery().where({ argFormat: formatId });
        qb = joinPropertyArguments("x", qb);
        qb = qb.innerJoinAndSelect("x.format", "format")
        qb = qb.addSelect(
            qb =>
                qb.select('COUNT(*)', 'contentCount')
                    .from(Content, 'c')
                    .innerJoin("c.container", "container")
                    .where('container.formatId = x.formatId'),
            'contentCount',
        );
        const props = await qb.getRawAndEntities();
        const relations: Relation[] = props.entities.map((prop, i) => {
            return {
                property: toPropertyInfo(prop),
                contentCount: parseInt(props.raw[i].contentCount),
                formatId: prop.format.entityId
            }
        });
        return relations;
    }
}

export class FormatCommand implements BaseCommand {
    constructor(
        private formats: Command<Format>,
        private structures: Command<Structure>,
        private props: Command<Property>,
        private metaProps: Command<MetaProperty>) {
    }

    async _setTypeArguments(prop: Property, tyArgs: Type) {
        if (tyArgs.language) {
            prop.argLanguage = tyArgs.language;
        }
        if (tyArgs.subType) {
            prop.argType = tyArgs.subType.name;
        }
        if (tyArgs.format) {
            prop.argFormat = await this.formats.findOne({ entityId: tyArgs.format.formatId }) || null;
        }
    }

    async _setSubProperties(formatId: number, prop: Property, tyArgs: Type) {
        if (tyArgs.properties) {
            await Promise.all(tyArgs.properties.map((x, i) => this._createProperty(formatId, prop.id, i, x)));
        }
    }

    async _createProperty(formatId: number, parentPropertyId: number | null, order: number, info: PropertyInfo) {
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
        await this._setTypeArguments(prop, info.type);
        if (info.type.subType) {
            await this._setTypeArguments(prop, info.type.subType);
        }

        // save
        prop = await this.props.save(prop);

        // set properties
        await this._setSubProperties(formatId, prop, info.type);
        if (info.type.subType) {
            await this._setSubProperties(formatId, prop, info.type.subType);
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

        // 新プロパティにもある旧プロパティ (古い共通のプロパティ)
        const oldProps = format.properties.filter(x => properties.filter(y => x.entityId == y.id).length > 0);
        // 旧プロパティにもある新プロパティ (新しい共通のプロパティ)
        const oldProps2 = properties.filter(x => format.properties.filter(y => x.id == y.entityId).length > 0);
        // 新規のプロパティ
        const newProps = properties.filter(x => format.properties.filter(y => x.id == y.entityId).length == 0);

        // Update old properties
        const promises = oldProps2.map(async prop => {
            await this.props.update({ formatId: format.id, entityId: prop.id }, {
                displayName: prop.displayName,
                fieldName: prop.fieldName
            });
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

    async setFormatDisplayId(formatId: FormatSk, displayId: FormatDisplayId) {
        await this.formats.update(formatId, { displayId });
    }

    async setFormatDisplayName(formatId: FormatSk, displayName: string) {
        await this.formats.update(formatId, { displayName });
    }

    async setFormatFontawesome(formatId: FormatSk, fontawesome: string | null) {
        await this.formats.update(formatId, { fontawesome });
    }
}