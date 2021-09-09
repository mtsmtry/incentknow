import { ContentDraftSk } from "../../../entities/content/ContentDraft";
import { MaterialSk } from "../../../entities/material/Material";
import { MaterialCommit } from "../../../entities/material/MaterialCommit";
import { MaterialChangeType, MaterialDraft, MaterialDraftSk } from "../../../entities/material/MaterialDraft";
import { MaterialEditing, MaterialEditingState } from "../../../entities/material/MaterialEditing";
import { MaterialSnapshot } from "../../../entities/material/MaterialSnapshot";
import { SpaceSk } from "../../../entities/space/Space";
import { UserSk } from "../../../entities/user/User";
import { encodeMaterialData, MaterialData } from "../../../interfaces/material/Material";
import { InternalError } from "../../../services/Errors";
import { MaterialDraftQuery, MaterialDraftQueryFromEntity } from "../../queries/material/MaterialDraftQuery";
import { MaterialEditingQuery } from "../../queries/material/MaterialEditingQuery";
import { MaterialSnapshotQuery } from "../../queries/material/MaterialSnapshotQuery";
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

    fromSnapshots(trx?: Transaction) {
        return new MaterialSnapshotQuery(this.snapshots.createQuery(trx));
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

    async getOrCreateActiveDraft(userId: UserSk, materialId: MaterialSk, materialData: MaterialData, basedCommit: MaterialCommit | null) {
        // validate basedCommit
        if (basedCommit && basedCommit.materialId != materialId) {
            throw "The material of the specified forked commit is not the specified material";
        }

        // get or create draft
        let draft = await this.drafts.findOne({ materialId, userId });
        if (!draft) {
            draft = this.drafts.create({ materialId, userId });
            draft = await this.drafts.save(draft);
        }

        // activate draft
        if (!draft.currentEditingId) {
            let editing = this.editings.create({
                draftId: draft.id,
                basedCommitId: basedCommit?.id,
                state: MaterialEditingState.EDITING
            });
            editing = await this.editings.save(editing);

            let snapshot = this.snapshots.create({
                ...encodeMaterialData(materialData),
                editingId: editing.id
            })
            snapshot = await this.snapshots.save(snapshot);

            await Promise.all([
                this.drafts.update(draft.id, { currentEditingId: editing.id }),
                this.editings.update(editing.id, { snapshotId: snapshot.id })
            ]);
        } else {
            let snapshot = this.snapshots.create({
                ...encodeMaterialData(materialData),
                editingId: draft.currentEditingId
            })
            snapshot = await this.snapshots.save(snapshot);

            await this.editings.update(draft.currentEditingId, { snapshotId: snapshot.id });
        }

        return new MaterialDraftQueryFromEntity(draft);
    }

    async activateDraft(materialDraftId: MaterialDraftSk, basedCommit: MaterialCommit) {
        // get or create draft
        let draft = await this.drafts.findOne({ id: materialDraftId });
        if (!draft) {
            throw new InternalError();
        }

        // activate draft
        if (!draft.currentEditingId) {
            let editing = this.editings.create({
                draftId: draft.id,
                basedCommitId: basedCommit.id
            });
            editing = await this.editings.save(editing);

            let snapshot = this.snapshots.create({
                editingId: editing.id,
                data: basedCommit.data
            })
            await this.editings.update(draft.id, { snapshotId: snapshot.id });
        }

        return new MaterialDraftQueryFromEntity(draft);
    }

    async createActiveBlankDraft(userId: UserSk, spaceId: SpaceSk | null, materialData: MaterialData) {
        // create draft
        let draft = this.drafts.create({
            intendedSpaceId: spaceId,
            intendedMaterialType: materialData.type,
            userId
        });
        draft = await this.drafts.save(draft);

        // create editing
        let editing = this.editings.create({
            draftId: draft.id,
            state: MaterialEditingState.EDITING
        });
        editing = await this.editings.save(editing);

        // create snapshot
        let snapshot = this.snapshots.create({
            ...encodeMaterialData(materialData),
            editingId: editing.id
        })
        snapshot = await this.snapshots.save(snapshot);

        // set editing to draft
        await Promise.all([
            this.editings.update(editing.id, { snapshotId: snapshot.id }),
            this.drafts.update(draft.id, { currentEditingId: editing.id })
        ])

        return new MaterialDraftQueryFromEntity(draft);
    }

    async updateDraft(draft: MaterialDraft, materialData: MaterialData): Promise<MaterialSnapshot | null> {
        const encodedData = encodeMaterialData(materialData);

        const currentEditing = draft.currentEditing;
        if (!currentEditing) {
            throw "This draft is not active";
        }

        if (currentEditing.snapshot.data == encodedData.data) {
            return null;
        }

        if (currentEditing.snapshot.data) {
            const changeType = getChangeType(currentEditing.snapshot.data.length, encodedData.data.length);

            // create snapshot if the number of characters takes the maximum value
            if (draft.changeType != MaterialChangeType.REMOVE && changeType == MaterialChangeType.REMOVE) {
                let snapshot = this.snapshots.create({
                    editingId: currentEditing.id,
                    ...encodedData,
                    timestamp: draft.updatedAt
                });
                snapshot = await this.snapshots.save(snapshot);

                await Promise.all([
                    this.drafts.update(draft.id, { changeType }),
                    this.editings.update(currentEditing.id, { snapshotId: snapshot.id })
                ]);

                return snapshot;
            } else {
                await this.snapshots.update(currentEditing.snapshot, encodedData);
            }
        } else {
            await this.snapshots.update(currentEditing.snapshot.id, encodedData);
        }
        return null;
    }

    async closeEditing(draft: MaterialDraft, state: MaterialEditingState) {
        if (state == MaterialEditingState.EDITING) {
            throw "Editing is not closed state";
        }
        await Promise.all([
            this.drafts.update(draft.id, { currentEditingId: null }),
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