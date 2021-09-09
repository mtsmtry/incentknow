import { FormatId } from "../../entities/format/Format";
import { MetaProperty, MetaPropertyId, MetaPropertyType } from "../../entities/format/MetaProperty";
import { Language, Property, PropertyId, TypeName } from "../../entities/format/Property";
import { Structure } from "../../entities/format/Structure";
import { Data, DataKind, DataMember, Int } from "../../Implication";
import { toTimestamp } from "../Utils";
import { FocusedFormat, toFocusedFormat } from "./Format";

export interface IntactMetaProperty {
    id: MetaPropertyId;
    type: MetaPropertyType;
}

export function toIntactMetaProperty(meta: MetaProperty): IntactMetaProperty {
    return {
        id: meta.entityId,
        type: meta.type
    };
}

export interface PropertyInfo {
    displayName: string,
    fieldName: string | null,
    id: PropertyId,
    optional: boolean,
    semantic: string | null,
    icon: string | null,
    type: Type,
    metaProperties: IntactMetaProperty[]
}

export interface Enumerator {
    id: string;
    displayName: string;
    fieldName: string | null;
}

@Data()
export class Type {
    @DataKind()
    name: TypeName;

    @DataMember([TypeName.CONTENT, TypeName.ENTITY])
    format?: FocusedFormat;

    @DataMember([TypeName.ARRAY])
    subType?: Type;

    @DataMember([])
    language?: Language;

    @DataMember([TypeName.OBJECT])
    properties?: PropertyInfo[];

    @DataMember([TypeName.ENUM])
    enumerators?: Enumerator[];

    constructor(src: Partial<Type>) {
        Object.assign(this, src);
    }
}

export function toPropertyInfo(prop: Property): PropertyInfo {
    const metaProps = prop.metaProperties || [];
    const res: PropertyInfo = {
        id: prop.entityId,
        displayName: prop.displayName,
        fieldName: prop.fieldName,
        optional: prop.optional,
        semantic: prop.semantic,
        icon: prop.icon,
        metaProperties: metaProps.map(toIntactMetaProperty),
        type: new Type({
            name: prop.typeName
        })
    }

    if (prop.typeName == TypeName.ARRAY) {
        Object.assign(res.type, {
            name: prop.argType,
            format: prop.argFormat ? toFocusedFormat(prop.argFormat) : null,
            language: prop.argLanguage,
            properties: (prop.argProperties || []).map(toPropertyInfo)
        });
    } else {
        Object.assign(res.type, {
            format: prop.argFormat ? toFocusedFormat(prop.argFormat) : null,
            language: prop.argLanguage,
            properties: (prop.argProperties || []).map(toPropertyInfo),
        });
    }

    return res;
}

export type StructureId = string;

export interface RelatedStructure {
    formatId: FormatId;
    structureId: StructureId;
    version: Int;
    title: string | null;
    createdAt: number;
}

export function toRelatedStructure(structure: Structure): RelatedStructure {
    return {
        formatId: structure.format.entityId,
        structureId: structure.entityId,
        version: structure.version,
        title: structure.title,
        createdAt: toTimestamp(structure.createdAt)
    }
}

export interface FocusedStructure {
    structureId: StructureId;
    version: Int;
    title: string | null;
    properties: PropertyInfo[];
    createdAt: number;
}

export function toFocusedStructure(structure: Structure): FocusedStructure {
    return {
        structureId: structure.entityId,
        version: structure.version,
        title: structure.title,
        properties: structure.properties.map(toPropertyInfo),
        createdAt: toTimestamp(structure.createdAt)
    };
}
