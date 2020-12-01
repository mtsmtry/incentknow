import { Format, FormatUsage } from "../../../entities/format/format";
import { Property } from "../../../entities/format/property";
import { Structure } from "../../../entities/format/structure";
import { SpaceSk } from "../../../entities/space/space";
import { UserSk } from "../../../entities/user/user";
import { PropertyInfo, Type } from "../../../interfaces/format/structure";
import { FormatQuery, FormatQueryFromEntity } from "../../queries/format/format";
import { StructureQuery } from "../../queries/format/structure";
import { BaseCommand, BaseRepository, Command, Repository } from "../../repository";
import { Transaction } from "../../transaction";

export class FormatRepository implements BaseRepository<FormatCommand> {
    constructor(
        private formats: Repository<Format>,
        private structures: Repository<Structure>,
        private props: Repository<Property>) {
    }

    fromFormats(trx?: Transaction) {
        return new FormatQuery(this.formats.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new FormatCommand(
            this.formats.createCommand(trx),
            this.structures.createCommand(trx),
            this.props.createCommand(trx));
    }
}

export class FormatCommand implements BaseCommand {
    constructor(
        private formats: Command<Format>,
        private structures: Command<Structure>,
        private props: Command<Property>) {
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
        // Format
        let format = this.formats.create({
            creatorUserId: userId,
            updaterUserId: userId,
            spaceId,
            displayName,
            description,
            usage
        });
        format = await this.formats.save(format);

        // Structure
        let structure = this.structures.create({
            formatId: format.id
        });
        structure = await this.structures.save(structure);

        // Properties
        let props = await Promise.all(properties.map((x, i) => this._createProperty(format.id, null, i, x)));
        props = await this.props.save(props);

        // Format
        this.formats.update(format.id, { currentStructureId: structure.id });

        return new FormatQueryFromEntity(format);
    }
}