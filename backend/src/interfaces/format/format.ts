import { Format, FormatDisplayId, FormatId, FormatUsage } from "../../entities/format/Format";
import { Structure } from "../../entities/format/Structure";
import { RelatedSpace, toRelatedSpace } from "../space/Space";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { FocusedStructure, RelatedStructure, toFocusedStructure, toRelatedStructure } from "./Structure";

export interface RelatedFormat {
    formatId: FormatId;
    displayId: FormatDisplayId;
    displayName: string;
    description: string;
    space: RelatedSpace;
    usage: FormatUsage;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
    semanticId: string | null;
    currentStructure: RelatedStructure;
}

export function toRelatedFormat(format: Format): RelatedFormat {
    return {
        formatId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: toRelatedSpace(format.space),
        usage: format.usage,
        createdAt: toTimestamp(format.createdAt),
        creatorUser: toRelatedUser(format.creatorUser),
        updatedAt: toTimestamp(format.updatedAt),
        updaterUser: toRelatedUser(format.updaterUser),
        semanticId: format.semanticId,
        currentStructure: toRelatedStructure(format.currentStructure)
    }
}

export interface FocusedFormat {
    formatId: FormatId;
    displayId: FormatDisplayId;
    displayName: string;
    description: string;
    space: RelatedSpace;
    usage: FormatUsage;
    createdAt: number;
    creatorUser: RelatedUser;
    updatedAt: number;
    updaterUser: RelatedUser;
    currentStructure: FocusedStructure;
    semanticId: string | null;
}

export function toFocusedFormat(format: Format): FocusedFormat {
    return {
        formatId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        space: toRelatedSpace(format.space),
        usage: format.usage,
        createdAt: toTimestamp(format.createdAt),
        creatorUser: toRelatedUser(format.creatorUser),
        updatedAt: toTimestamp(format.updatedAt),
        updaterUser: toRelatedUser(format.updaterUser),
        currentStructure: toFocusedStructure(format.currentStructure),
        semanticId: format.semanticId
    }
}

export function toFocusedFormatFromStructure(structure: Structure): FocusedFormat {
    return {
        formatId: structure.format.entityId,
        displayId: structure.format.displayId,
        displayName: structure.format.displayName,
        description: structure.format.description,
        space: toRelatedSpace(structure.format.space),
        usage: structure.format.usage,
        createdAt: toTimestamp(structure.format.createdAt),
        creatorUser: toRelatedUser(structure.format.creatorUser),
        updatedAt: toTimestamp(structure.format.updatedAt),
        updaterUser: toRelatedUser(structure.format.updaterUser),
        currentStructure: toFocusedStructure(structure),
        semanticId: structure.format.semanticId
    }
}