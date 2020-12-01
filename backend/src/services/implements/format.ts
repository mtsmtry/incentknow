import { FormatDisplayId, FormatId, FormatUsage } from '../../entities/format/format';
import { SpaceAuth, SpaceId } from '../../entities/space/space';
import { FocusedFormat, RelatedFormat } from '../../interfaces/format/format';
import { PropertyInfo } from '../../interfaces/format/structure';
import { FormatRepository } from '../../repositories/implements/format/format';
import { AuthorityRepository } from "../../repositories/implements/space/authority";
import { AuthenticatedService } from "../authenticated_service";

export class SpaceService extends AuthenticatedService {
    constructor(
        private formats: FormatRepository,
        private auth: AuthorityRepository) {
        super();
    }

    async createFormat(spaceId: SpaceId, displayName: string, description: string, usage: FormatUsage, properties: PropertyInfo[]): Promise<FormatId> {
        return await this.transactionAuthorized(async (trx, userId) => {
            const [auth, space] = await this.auth.fromAuths(trx).getSpaceAuth(SpaceAuth.WRITABLE, userId, spaceId);
            if (!auth) {
                throw new LackOfAuthority()
            }
            const format = await this.formats.createCommand(trx).createFormat(userId, space.id, displayName, description, usage, properties);
            return format.raw.entityId;
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
        const userId = this.getAuthorized();
        const [auth, space] = await this.auth.fromAuths().getSpaceAuth(SpaceAuth.VISIBLE, userId, spaceId);
        return await this.formats.fromFormats().bySpace(space.id).selectRelated().getMany();
    }

    async updateFormatStructure(formatId: FormatId, properties: PropertyInfo[]): Promise<{}> {
        return {};
    }
}