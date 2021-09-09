import { ObjectLiteral } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentDraft, ContentDraftSk, ContentDraftState } from "../../../entities/content/ContentDraft";
import { StructureSk } from "../../../entities/format/Structure";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { ContentDraftQuery, ContentDraftQueryFromEntity } from "../../queries/content/ContentDraftQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class ContentEditingRepository implements BaseRepository<ContentEditingCommand> {
    constructor(
        private drafts: Repository<ContentDraft>) {
    }

    fromDrafts(trx?: Transaction) {
        return new ContentDraftQuery(this.drafts.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ContentEditingCommand(
            this.drafts.createCommand(trx));
    }
}

export class ContentEditingCommand implements BaseCommand {
    constructor(
        private drafts: Command<ContentDraft>) {
    }

    async getOrCreateActiveDraft(userId: UserSk, contentId: ContentSk, data: any, structureId: StructureSk) {
        // get or create draft
        let draft = await this.drafts.findOne({ contentId, userId });
        if (!draft) {
            draft = this.drafts.create({ contentId, userId, data, updatedAtOnlyContent: new Date(), structureId });
            draft = await this.drafts.save(draft);
        } else {
            await this.drafts.update(draft.id, { data, state: ContentDraftState.EDITING });
        }

        return new ContentDraftQueryFromEntity(draft);
    }

    async createActiveBlankDraft(userId: UserSk, structureId: StructureSk, spaceId: SpaceSk | null, data: ObjectLiteral) {
        // create draft
        let draft = this.drafts.create({
            structureId: structureId,
            intendedSpaceId: spaceId,
            data,
            userId
        });
        draft = await this.drafts.save(draft);

        return new ContentDraftQueryFromEntity(draft);
    }

    async updateDraft(draft: ContentDraft, data: any) {
        if (draft.state != ContentDraftState.EDITING) {
            throw "This draft is not active";
        }

        await this.drafts.update(draft.id, { data });
        return null;
    }

    async cancelEditing(draft: ContentDraft) {
        await this.drafts.update(draft.id, { state: ContentDraftState.CANCELED });
    }

    async commitEditing(draft: ContentDraft) {
        await this.drafts.update(draft.id, { state: ContentDraftState.COMMITTED });
    }

    async updateDraftTimestamp(draftId: ContentDraftSk) {
        await this.drafts.update(draftId, {
            updatedAt: new Date()
        })
    }

    async makeDraftContent(draftId: ContentDraftSk, contentId: ContentSk) {
        await this.drafts.update(draftId, {
            contentId,
            intendedSpaceId: null
        });
    }
}