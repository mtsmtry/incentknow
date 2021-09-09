import { Format, FormatDisplayId, FormatId, FormatUsage } from "../../entities/format/Format";
import { Structure, StructureId } from "../../entities/format/Structure";
import { RelatedSpace, toRelatedSpace } from "../space/Space";
import { RelatedUser, toRelatedUser } from "../user/User";
import { toTimestamp } from "../Utils";
import { FocusedStructure, PropertyInfo, toFocusedStructure } from "./Structure";

export interface RelatedFormat {
    formatId: FormatId;
    displayId: FormatDisplayId;
    displayName: string;
    description: string;
    icon: string | null;
    space: RelatedSpace;
    usage: FormatUsage;
    semanticId: string | null;
    currentStructureId: StructureId;
}

export function toRelatedFormat(format: Format): RelatedFormat {
    format.currentStructure.format = format;
    return {
        formatId: format.entityId,
        displayId: format.displayId,
        displayName: format.displayName,
        description: format.description,
        icon: format.icon,
        space: toRelatedSpace(format.space),
        usage: format.usage,
        semanticId: format.semanticId,
        currentStructureId: format.currentStructure.entityId
    }
}

export interface Relation {
    property: PropertyInfo;
    contentCount: number;
    formatId: FormatId;
}

export interface FocusedFormat {
    formatId: FormatId;
    displayId: FormatDisplayId;
    displayName: string;
    description: string;
    icon: string | null,
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
        icon: format.icon,
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
        icon: structure.format.icon,
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