import { ContentDraftSk } from "../../../entities/content/ContentDraft";
import { MaterialSk, MaterialType } from "../../../entities/material/Material";
import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { MaterialChangeType, MaterialDraft, MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { MaterialEditing, MaterialEditingState } from "../../../entities/material/MaterialEditing";
import { MaterialSnapshot } from "../../../entities/material/MaterialSnapshot";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { InternalError } from "../../../services/Errors";
import { MaterialDraftQuery, MaterialDraftQueryFromEntity } from "../../queries/material/MaterialDraftQuery";
import { MaterialEditingQuery } from "../../queries/material/MaterialEditingQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

function getChangeType(prevLength: number, length: number) {
    // 文字数で変更の種類を分類
    if (prevLength <= length) {
        return MaterialChangeType.WRITE;
    } else if (prevLength > length) {
        return MaterialChangeType.REMOVE;
    }
}

export class MaterialEditingRepository implements BaseRepository<MaterialEditingCommand> {
    constructor(
        private drafts: Repository<MaterialDraft>,
        private editings: Repository<MaterialEditing>,
        private snapshots: Repository<MaterialSnapshot>) {
    }

    fromDrafts(trx?: Transaction) {
        return new MaterialDraftQuery(this.drafts.createQuery(trx));
    }

    fromEditings(trx?: Transaction) {
        return new MaterialEditingQuery(this.editings.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new MaterialEditingCommand(
            this.drafts.createCommand(trx),
            this.editings.createCommand(trx),
            this.snapshots.createCommand(trx)
        );
    }
}

export class MaterialEditingCommand implements BaseCommand {
    constructor(
        private drafts: Command<MaterialDraft>,
        private editings: Command<MaterialEditing>,
        private snapshots: Command<MaterialSnapshot>) {
    }

    async trasferToContentDraft(materialDraftId: MaterialDraftSk, contentDraftId: ContentDraftSk) {
        await this.drafts.update({ id: materialDraftId }, { intendedSpaceId: null, intendedContentDraftId: contentDraftId });
    }

    async trasferToSpace(materialDraftId: MaterialDraftSk, spaceId: SpaceSk) {
        await this.drafts.update({ id: materialDraftId }, { intendedSpaceId: spaceId, intendedContentDraftId: null });
    }

    async getOrCreateActiveDraft(userId: UserSk, materialId: MaterialSk, data: string, basedCommit: MaterialCommit | null) {
        // validate basedCommit
        if (basedCommit && basedCommit.materialId != materialId) {
            throw "The material of the specified forked commit is not the specified material";
        }

        // get or create draft
        let draft = await this.drafts.findOne({ materialId, userId });
        if (!draft) {
            draft = this.drafts.create({ materialId, userId, data });
            draft = await this.drafts.save(draft);
        } else if (!draft.data) {
            await this.drafts.update({ id: draft.id }, { data });
            draft.data = data;
        }

        // activate draft
        if (!draft.currentEditingId) {
            let editing = this.editings.create({
                draftId: draft.id,
                basedCommitId: basedCommit?.id,
                userId: userId,
                state: MaterialEditingState.EDITING
            });
            editing = await this.editings.save(editing);
            await this.drafts.update(draft.id, { currentEditingId: editing.id });
        }

        return new MaterialDraftQueryFromEntity(draft);
    }

    async activateDraft(materialDraftId: MaterialDraftSk, basedCommit: MaterialCommit) {
        // get or create draft
        let draft = await this.drafts.findOne({ id: materialDraftId });
        if (!draft) {
            throw new InternalError();
        }

        console.log(draft);

        // activate draft
        if (!draft.currentEditingId) {
            let editing = this.editings.create({
                draftId: draft.id,
                basedCommitId: basedCommit.id,
                userId: draft.userId,
                state: MaterialEditingState.EDITING
            });
            editing = await this.editings.save(editing);
            console.log(editing);
            await this.drafts.update(draft.id, { currentEditingId: editing.id, data: basedCommit.data });
        }

        return new MaterialDraftQueryFromEntity(draft);
    }

    async createActiveBlankDraft(userId: UserSk, spaceId: SpaceSk | null, type: MaterialType, data: string | null) {
        // create draft
        let draft = this.drafts.create({
            //intendedMaterialType: type,
            intendedSpaceId: spaceId,
            data,
            userId
        });
        draft = await this.drafts.save(draft);

        // create editing
        let editing = this.editings.create({
            draftId: draft.id,
            userId,
            state: MaterialEditingState.EDITING
        });
        editing = await this.editings.save(editing);

        // set editing to draft
        await this.drafts.update(draft.id, { currentEditingId: editing.id });

        return new MaterialDraftQueryFromEntity(draft);
    }

    async updateDraft(draft: MaterialDraft, data: any): Promise<MaterialSnapshot | null> {
        if (draft.data == data) {
            return null;
        }

        if (!draft.currentEditingId) {
            throw "This draft is not active";
        }

        if (draft.data) {
            const changeType = getChangeType(draft.data?.length, data.length);

            // create snapshot if the number of characters takes the maximum value
            if (draft.changeType != MaterialChangeType.REMOVE && changeType == MaterialChangeType.REMOVE) {
                let snapshot = this.snapshots.create({
                    draftId: draft.id,
                    editingId: draft.currentEditingId,
                    data: draft.data,
                    timestamp: draft.updatedAt
                });

                await Promise.all([
                    this.snapshots.save(snapshot),
                    this.drafts.update(draft.id, { data, changeType })
                ]);

                return snapshot;
            } else {
                await this.drafts.update(draft.id, { data, changeType });
            }
        } else {
            await this.drafts.update(draft.id, { data });
        }
        return null;
    }

    async closeEditing(draft: MaterialDraft, state: MaterialEditingState) {
        if (state == MaterialEditingState.EDITING) {
            throw "Editing is not closed state";
        }
        await Promise.all([
            this.drafts.update(draft.id, { data: null, currentEditingId: null }),
            this.editings.update(draft.currentEditingId, { state })
        ]);
    }

    async makeDraftContent(draftId: MaterialDraftSk, materialId: MaterialSk) {
        await this.drafts.update(draftId, {
            materialId,
            intendedSpaceId: null
        });
    }
}