import { Format, FormatDisplayId, FormatId, FormatUsage } from "../../entities/format/format";
import { Structure } from "../../entities/format/structure";
import { RelatedSpace, toRelatedSpace } from "../space/space";
import { RelatedUser, toRelatedUser } from "../user/user";
import { FocusedStructure, toFocusedStructure } from "./structure";

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
        semanticId: format.semanticId
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
    structure: FocusedStructure;
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
        structure: toFocusedStructure(format.currentStructure),
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
        structure: toFocusedStructure(structure),
        semanticId: structure.format.semanticId
    }
}