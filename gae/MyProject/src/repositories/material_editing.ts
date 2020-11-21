import { Repository } from "typeorm";
import { Material, MaterialSk, MaterialType } from "../entities/material/material";
import { MaterialCommit } from "../entities/material/material_commit";
import { MaterialChangeType, MaterialDraft } from "../entities/material/material_draft";
import { MaterialEditing, MaterialEditingState } from "../entities/material/material_editing";
import { MaterialSnapshot } from "../entities/material/material_snapshot";
import { Space, SpaceSk } from "../entities/space/space";
import { User, UserSk } from "../entities/user/user";
import { MaterialDraftId } from "../interfaces/material/material_draft";
import { MaterialDraftQuery } from "./queries/material/material_draft";

function getChangeType(prevLength: number, length: number) {
    // 文字数で変更の種類を分類
    if (prevLength <= length) {
        return MaterialChangeType.WRITE;
    } else if (prevLength > length) {
        return MaterialChangeType.REMOVE;
    }
}

export class MaterialEditingRepository {
    constructor(
        private drafts: Repository<MaterialDraft>,
        private editings: Repository<MaterialEditing>,
        private snapshots: Repository<MaterialSnapshot>) {
    }

    fromDrafts() {
        return new MaterialDraftQuery(this.drafts.createQueryBuilder("x"));
    }

    async getOrCreateActiveDraft(userId: UserSk, materialId: MaterialSk, forkedCommit: MaterialCommit | null): Promise<MaterialDraftId> {
        // validate forkedCommit
        if (forkedCommit.materialId != materialId) {
            throw "The material of the specified forked commit is not the specified material";
        }

        // get or create draft
        let draft = await this.drafts.findOne({ materialId });
        if (!draft) {
            draft = this.drafts.create({ materialId, userId });
            draft = await this.drafts.save(draft);
        }

        // activate draft
        if (!draft.currentEditing) {
            let editing = this.editings.create({
                draftId: draft.id,
                forkedCommitId: forkedCommit.id,
                userId: userId,
                state: MaterialEditingState.EDITING
            });
            editing = await this.editings.save(editing);
            await this.drafts.update(draft, { currentEditingId: editing.id });
        }

        return draft.entityId;
    }

    async getOrCreateActiveBlankDraft(userId: UserSk, spaceId: SpaceSk, displayName: string, type: MaterialType): Promise<MaterialDraftId> {
        // create draft
        let draft = this.drafts.create({
            intendedMaterialType: type,
            intendedDisplayName: displayName.split(" ").filter(x => x != "").join(" "),
            intendedSpaceId: spaceId,
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
        await this.drafts.update(draft, { currentEditing: editing });

        return draft.entityId;
    }

    async updateDraft(draft: MaterialDraft, data: any): Promise<MaterialSnapshot | null> {
        if (draft.data == data) {
            return null;
        }

        const changeType = getChangeType(draft.data.length, data.length);

        // create snapshot if the number of characters takes the maximum value
        if (draft.changeType != MaterialChangeType.REMOVE && changeType == MaterialChangeType.REMOVE) {
            let snapshot = this.snapshots.create({
                editing: this.editings.create({ id: draft.currentEditingId }),
                data: draft.data,
                timestamp: draft.updatedAt
            });

            await Promise.all([
                this.snapshots.save(snapshot),
                this.drafts.update(draft, { data, changeType })
            ]);

            return snapshot;
        } else {
            await this.drafts.update(draft, { data });

            return null;
        }
    }

    async closeEditing(draft: MaterialDraft, state: MaterialEditingState) {
        if (state == MaterialEditingState.EDITING) {
            throw "Editing is not closed state";
        }
        await Promise.all([
            this.drafts.update(draft, { data: null, currentEditing: null }),
            this.editings.update(draft.currentEditingId, { state })
        ]);
    }
}