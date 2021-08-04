import { ObjectLiteral } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentCommit } from "../../../entities/content/ContentCommit";
import { ContentChangeType, ContentDraft, ContentDraftSk } from "../../../entities/content/ContentDraft";
import { ContentEditing, ContentEditingState } from "../../../entities/content/ContentEditing";
import { ContentSnapshot } from "../../../entities/content/ContentSnapshot";
import { StructureSk } from "../../../entities/format/Structure";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { ContentDraftQuery, ContentDraftQueryFromEntity } from "../../queries/content/ContentDraftQuery";
import { ContentEditingQuery } from "../../queries/content/ContentEditing";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

function getChangeType(prevData: ObjectLiteral, data: ObjectLiteral) {
    const prevLength = JSON.stringify(prevData).length;
    const length = JSON.stringify(data).length;
    // 文字数で変更の種類を分類
    if (prevLength <= length) {
        return ContentChangeType.WRITE;
    } else if (prevLength > length) {
        return ContentChangeType.REMOVE;
    }
}

export class ContentEditingRepository implements BaseRepository<ContentEditingCommand> {
    constructor(
        private drafts: Repository<ContentDraft>,
        private editings: Repository<ContentEditing>,
        private snapshots: Repository<ContentSnapshot>) {
    }

    fromDrafts(trx?: Transaction) {
        return new ContentDraftQuery(this.drafts.createQuery(trx));
    }

    fromEditings(trx?: Transaction) {
        return new ContentEditingQuery(this.editings.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ContentEditingCommand(
            this.drafts.createCommand(trx),
            this.editings.createCommand(trx),
            this.snapshots.createCommand(trx));
    }
}

export class ContentEditingCommand implements BaseCommand {
    constructor(
        private drafts: Command<ContentDraft>,
        private editings: Command<ContentEditing>,
        private snapshots: Command<ContentSnapshot>) {
    }

    async getOrCreateActiveDraft(userId: UserSk, contentId: ContentSk, data: any, basedCommit: ContentCommit | null) {
        // validate basedCommit
        if (basedCommit && basedCommit.contentId != contentId) {
            throw "The content of the specified forked commit is not the specified content";
        }

        // get or create draft
        let draft = await this.drafts.findOne({ contentId, userId });
        if (!draft) {
            draft = this.drafts.create({ contentId, userId, updatedAtOnlyContent: new Date(), data });
            draft = await this.drafts.save(draft);
        } else if (!draft.data) {
            await this.drafts.update({ id: draft.id }, { data });
            draft.data = data;
        }

        // activate draft
        if (!draft.currentEditing) {
            let editing = this.editings.create({
                draftId: draft.id,
                basedCommitId: basedCommit?.id,
                userId: userId,
                state: ContentEditingState.EDITING
            });
            editing = await this.editings.save(editing);
            await this.drafts.update(draft.id, { currentEditingId: editing.id });
            draft.currentEditing = editing;
            draft.currentEditingId = editing.id;
        }

        return new ContentDraftQueryFromEntity(draft);
    }

    async createActiveBlankDraft(userId: UserSk, structureId: StructureSk, spaceId: SpaceSk | null, data: ObjectLiteral | null) {
        // create draft
        let draft = this.drafts.create({
            structureId: structureId,
            intendedSpaceId: spaceId,
            data,
            userId
        });
        draft = await this.drafts.save(draft);

        // create editing
        let editing = this.editings.create({
            draftId: draft.id,
            userId,
            state: ContentEditingState.EDITING
        });
        editing = await this.editings.save(editing);

        // set editing to draft
        await this.drafts.update(draft.id, { currentEditingId: editing.id });

        return new ContentDraftQueryFromEntity(draft);
    }

    async updateDraft(draft: ContentDraft, data: any): Promise<ContentSnapshot | null> {
        if (!draft.currentEditingId) {
            throw "This draft is not active";
        }

        if (draft.data) {
            const changeType = getChangeType(draft.data, data);

            // create snapshot if the number of characters takes the maximum value
            if (draft.changeType != ContentChangeType.REMOVE && changeType == ContentChangeType.REMOVE) {
                let snapshot = this.snapshots.create({
                    draftId: draft.id,
                    editingId: draft.currentEditingId,
                    structureId: draft.structureId,
                    data: draft.data,
                    timestamp: draft.updatedAt
                });

                await Promise.all([
                    this.snapshots.save(snapshot),
                    this.drafts.update(draft.id, { data, changeType, updatedAtOnlyContent: new Date() })
                ]);

                return snapshot;
            } else {
                await this.drafts.update(draft.id, { data, changeType, updatedAtOnlyContent: new Date() });
            }
        } else {
            await this.drafts.update(draft.id, { data });
        }
        return null;
    }

    async cancelEditing(draft: ContentDraft) {
        await Promise.all([
            this.drafts.update(draft.id, { data: null, currentEditingId: null }),
            this.editings.update(draft.currentEditingId, { state: ContentEditingState.CANCELD })
        ]);
    }

    async commitEditing(draft: ContentDraft) {
        await Promise.all([
            this.drafts.update(draft.id, { data: null, currentEditingId: null }),
            this.editings.update(draft.currentEditingId, { state: ContentEditingState.COMMITTED })
        ]);
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