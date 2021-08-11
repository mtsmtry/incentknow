import { ObjectLiteral } from "typeorm";
import { ContentId } from "../../entities/content/Content";
import { ContentCommitId } from "../../entities/content/ContentCommit";
import { ContentChangeType, ContentDraft, ContentDraftId } from "../../entities/content/ContentDraft";
import { TypeName } from "../../entities/format/Property";
import { mapByString } from "../../Utils";
import { FocusedFormat } from "../format/Format";
import { toRelatedMaterialDraft } from "../material/MaterialDraft";
import { toTimestamp } from "../Utils";

export interface RelatedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    basedCommitId: ContentCommitId | null;
    data: any;
    contentId: ContentId | null;
    format: FocusedFormat;
    changeType: ContentChangeType;
    isEditing: boolean;
}

function joinMaterials(draft: ContentDraft, format: FocusedFormat) {
    const materialDrafts = mapByString(draft.materialDrafts, x => x.entityId);
    const data = draft.data;
    if (data) {
        format.currentStructure.properties.forEach(prop => {
            const value = data[prop.id];
            if (!value) {
                return;
            }
            if (prop.type.name == TypeName.DOCUMENT) {
                if (!materialDrafts[value]) {
                    data[prop.id] = "deleted";
                } else {
                    data[prop.id] = toRelatedMaterialDraft(materialDrafts[value]);
                }
            }
        });
    }
    return data;
}

export function toRelatedContentDraft(draft: ContentDraft, format: FocusedFormat): RelatedContentDraft {
    const data = joinMaterials(draft, format);
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.currentEditing?.basedCommit ? draft.currentEditing?.basedCommit?.entityId : null,
        data,
        contentId: draft.content?.entityId || null,
        format,
        changeType: draft.changeType,
        isEditing: draft.currentEditingId != null
    }
}

export interface FocusedContentDraft {
    draftId: ContentDraftId;
    createdAt: number;
    updatedAt: number;
    basedCommitId: ContentCommitId | null;
    data: ObjectLiteral;
    contentId: ContentId | null;
    format: FocusedFormat;
    changeType: ContentChangeType;
    isEditing: boolean;
}

export function toFocusedContentDraft(draft: ContentDraft, format: FocusedFormat, data: ObjectLiteral): FocusedContentDraft {
    data = joinMaterials(draft, format) as ObjectLiteral;
    return {
        draftId: draft.entityId,
        createdAt: toTimestamp(draft.createdAt),
        updatedAt: toTimestamp(draft.updatedAt),
        basedCommitId: draft.currentEditing?.basedCommit ? draft.currentEditing?.basedCommit?.entityId : null,
        data: data,
        contentId: draft.content?.entityId || null,
        format,
        changeType: draft.changeType,
        isEditing: draft.currentEditingId != null
    }
}
