import { ContentSk } from "../../../entities/content/content";
import { ContentCommit } from "../../../entities/content/content_commit";
import { ContentChangeType, ContentDraft, ContentDraftSk } from "../../../entities/content/content_draft";
import { ContentEditing, ContentEditingState } from "../../../entities/content/content_editing";
import { ContentSnapshot } from "../../../entities/content/content_snapshot";
import { SpaceSk } from "../../../entities/space/space";
import { UserSk } from "../../../entities/user/user";
import { ContentDraftQuery, ContentDraftQueryFromEntity } from "../../queries/content/content_draft";
import { BaseCommand, BaseRepository, Command, Repository } from "../../repository";
import { Transaction } from "../../transaction";

function getChangeType(prevLength: number, length: number) {
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

    async getOrCreateActiveDraft(userId: UserSk, contentId: ContentSk, forkedCommit: ContentCommit | null) {
        // validate forkedCommit
        if (forkedCommit && forkedCommit.contentId != contentId) {
            throw "The content of the specified forked commit is not the specified content";
        }

        // get or create draft
        let draft = await this.drafts.findOne({ contentId });
        if (!draft) {
            draft = this.drafts.create({ contentId, userId, updatedAtOnlyContent: new Date() });
            draft = await this.drafts.save(draft);
        }

        // activate draft
        if (!draft.currentEditing) {
            let editing = this.editings.create({
                draftId: draft.id,
                forkedCommitId: forkedCommit?.id,
                userId: userId,
                state: ContentEditingState.EDITING
            });
            editing = await this.editings.save(editing);
            await this.drafts.update(draft, { currentEditingId: editing.id });
        }

        return new ContentDraftQueryFromEntity(draft);
    }

    async getOrCreateActiveBlankDraft(userId: UserSk, spaceId: SpaceSk) {
        // create draft
        let draft = this.drafts.create({
            intendedSpaceId: spaceId,
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
        await this.drafts.update(draft, { currentEditing: editing });

        return new ContentDraftQueryFromEntity(draft);
    }

    async updateDraft(draft: ContentDraft, data: any): Promise<ContentSnapshot | null> {
        if (draft.data == data) {
            return null;
        }

        if (!draft.currentEditingId) {
            throw "This draft is not active";
        }

        if (draft.data) {
            const changeType = getChangeType(draft.data?.length, data.length);

            // create snapshot if the number of characters takes the maximum value
            if (draft.changeType != ContentChangeType.REMOVE && changeType == ContentChangeType.REMOVE) {
                let snapshot = this.snapshots.create({
                    editingId: draft.currentEditingId,
                    data: draft.data,
                    timestamp: draft.updatedAt
                });

                await Promise.all([
                    this.snapshots.save(snapshot),
                    this.drafts.update(draft, { data, changeType, updatedAtOnlyContent: new Date() })
                ]);

                return snapshot;
            }
        }

        await this.drafts.update(draft, { data });
        return null;
    }

    async closeEditing(draft: ContentDraft, state: ContentEditingState) {
        if (state == ContentEditingState.EDITING) {
            throw "Editing is not closed state";
        }
        await Promise.all([
            this.drafts.update(draft, { data: null, currentEditingId: null }),
            this.editings.update(draft.currentEditingId, { state })
        ]);
    }

    async updateDraftTimestamp(draftId: ContentDraftSk) {
        await this.drafts.update(draftId, {
            updatedAt: new Date()
        })
    }
}