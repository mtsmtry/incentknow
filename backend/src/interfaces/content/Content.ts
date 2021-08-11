
// Content ------------------------------

import { Content, ContentId } from "../../entities/content/Content";
import { TypeName } from "../../entities/format/Property";
import { Int } from "../../Implication";
import { mapByString } from "../../Utils";
import { FocusedFormat } from "../format/Format";
import { toFocusedMaterial, toRelatedMaterial } from "../material/Material";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { RelatedContentDraft } from "./ContentDraft";

export interface RelatedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: Int;
    viewCount: Int;
    format: FocusedFormat;
    data: any;
}

function joinMaterials(content: Content, format: FocusedFormat) {
    const materials = mapByString(content.materials, x => x.entityId);
    format.currentStructure.properties.forEach(prop => {
        const value = content.data[prop.id];
        if (!value) {
            return;
        }
        if (prop.type.name == TypeName.DOCUMENT) {
            if (!materials[value]) {
                content.data[prop.id] = "deleted";
            } else {
                content.data[prop.id] = toRelatedMaterial(materials[value]);
            }
        }
    });
}

export function toRelatedContent(content: Content, format: FocusedFormat): RelatedContent {
    joinMaterials(content, format);
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        data: content.data
    };
}

export interface FocusedContent {
    contentId: ContentId;
    createdAt: number;
    updatedAt: number;
    creatorUser: RelatedUser;
    updaterUser: RelatedUser;
    updateCount: number;
    viewCount: number;
    format: FocusedFormat;
    draft: RelatedContentDraft | null;
    data: any;
}

export function toFocusedContent(content: Content, draft: RelatedContentDraft | null, format: FocusedFormat): FocusedContent {
    joinMaterials(content, format);
    return {
        contentId: content.entityId,
        createdAt: toTimestamp(content.createdAt),
        updatedAt: toTimestamp(content.updatedAt),
        creatorUser: toRelatedUser(content.creatorUser),
        updaterUser: toRelatedUser(content.updaterUser),
        updateCount: content.updateCount,
        viewCount: content.viewCount,
        format: format,
        draft: draft,
        data: content.data
    };
}



