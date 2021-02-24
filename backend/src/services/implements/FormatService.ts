import { FormatDisplayId, FormatId, FormatUsage } from '../../entities/format/Format';
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
        return await this.formats.fromFormats().byDisplayId(formatDisplayId).selectFocused().getNeededOne();
    }

    async getFocusedFormat(formatId: FormatId): Promise<FocusedFormat> {
        return await this.formats.fromFormats().byEntityId(formatId).selectFocused().getNeededOne();
    }

    async getRelatedFormat(formatId: FormatId): Promise<RelatedFormat> {
        return await this.formats.fromFormats().byEntityId(formatId).selectRelated().getNeededOne();
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
        return {};
    }
}