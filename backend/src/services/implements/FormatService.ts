import { FormatDisplayId, FormatId, FormatUsage } from '../../entities/format/Format';
import { MetaPropertyId, MetaPropertyType } from '../../entities/format/MetaProperty';
import { PropertyId } from '../../entities/format/Property';
import { StructureId } from '../../entities/format/Structure';
import { SpaceAuth, SpaceId } from '../../entities/space/Space';
import { FocusedFormat, RelatedFormat } from '../../interfaces/format/Format';
import { PropertyInfo, RelatedStructure } from '../../interfaces/format/Structure';
import { FormatRepository } from '../../repositories/implements/format/FormatRepository';
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { BaseService } from "../BaseService";
import { LackOfAuthority } from '../Errors';
import { ServiceContext } from '../ServiceContext';

export class FormatService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private formats: FormatRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    async createFormat(spaceId: SpaceId, displayName: string, description: string, usage: FormatUsage, properties: PropertyInfo[]): Promise<FormatDisplayId> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority()
            }
            const format = await this.formats.createCommand(trx).createFormat(userId, space.id, displayName, description, usage, properties);
            return format.raw.displayId;
        });
    }

    async getFormat(formatDisplayId: FormatDisplayId): Promise<FocusedFormat> {
        const [format, formatRaw] = await this.formats.fromFormats().byDisplayId(formatDisplayId).selectFocused().getNeededOneWithRaw();
        //const relations = await this.formats.getRelations(formatRaw.id);
        //return buildFormat(relations);
        return format;
    }

    async getFocusedFormat(formatId: FormatId): Promise<FocusedFormat> {
        const [format, formatRaw] = await this.formats.fromFormats().byEntityId(formatId).selectFocused().getNeededOneWithRaw();
        //const relations = await this.formats.getRelations(formatRaw.id);
        //return buildFormat(relations);
        return format;
    }

    async getRelatedFormat(formatId: FormatId): Promise<RelatedFormat> {
        return await this.formats.fromFormats().byEntityId(formatId).selectRelated().getNeededOne();
    }

    async getFocusedFormatByStructure(structureId: StructureId): Promise<FocusedFormat> {
        return await this.formats.fromStructures().byEntityId(structureId).selectFocusedFormat().getNeededOne();
    }

    async getRelatedStructure(structureId: StructureId): Promise<RelatedStructure> {
        return await this.formats.fromStructures().byEntityId(structureId).selectRelated().getNeededOne();
    }

    async getFormats(spaceId: SpaceId): Promise<RelatedFormat[]> {
        const userId = this.ctx.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        return await this.formats.fromFormats().bySpace(space.id).selectRelated().getMany();
    }

    async getStructures(formatId: FormatId): Promise<RelatedStructure[]> {
        const format = await this.formats.fromFormats().byEntityId(formatId).selectId().getNeededOne();
        return await this.formats.fromStructures().byFormat(format).selectRelated().getMany();
    }

    async updateFormatStructure(formatId: FormatId, properties: PropertyInfo[]): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const format = await this.formats.fromFormats().byEntityId(formatId).joinProperties().joinCurrentStructure().getNeededOne();
            const struct = await this.formats.fromStructures().byId(format.currentStructureId).selectPropertiesJoined().getNeededOne();
            await this.formats.createCommand(trx).updateStructure(format, properties);
            return {};
        });
    }

    async addMetaProperty(formatId: FormatId, propertyId: PropertyId, type: MetaPropertyType) {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const format = await this.formats.fromFormats(trx).byEntityId(formatId).getNeededOne();
            const prop = await this.formats.fromProperty(trx).byFormat(format.id).byEntityId(propertyId).getNeededOne();
            await this.formats.createCommand(trx).addMetaProperty(prop.id, type);
        });
    }

    async removeMetaProperty(formatId: FormatId, metaPropertyId: MetaPropertyId) {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.formats.createCommand(trx).removeMetaProperty(metaPropertyId);
        });
    }

    async setFormatDisplayName(formatId: FormatId, displayName: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, format] = await this.auth.fromAuths(trx).getFormatAuth(SpaceAuth.WRITABLE, userId, formatId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.formats.createCommand(trx).setFormatDisplayName(format.id, displayName);
            return {};
        });
    }

    async setFormatDisplayId(formatId: FormatId, displayId: FormatDisplayId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, format] = await this.auth.fromAuths(trx).getFormatAuth(SpaceAuth.WRITABLE, userId, formatId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.formats.createCommand(trx).setFormatDisplayId(format.id, displayId);
            return {};
        });
    }

    async setFormatIcon(formatId: FormatId, icon: string | null): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const [auth, format] = await this.auth.fromAuths(trx).getFormatAuth(SpaceAuth.WRITABLE, userId, formatId);
            if (!auth) {
                throw new LackOfAuthority();
            }
            await this.formats.createCommand(trx).setFormatIcon(format.id, icon);
            return {};
        });
    }

    async getAvailableFormatDisplayId(formatDisplayId: FormatDisplayId): Promise<boolean> {
        const spaces = await this.formats.fromFormats().byDisplayId(formatDisplayId).selectId().getMany();
        return spaces.length == 0;
    }
}