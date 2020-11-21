import { Format, FormatUsage } from "../../entities/format/format";
import { Language, Property, TypeName } from "../../entities/format/property";
import { Structure } from "../../entities/format/structure";
import { RelatedSpace, toRelatedSpace } from "../space/space";
import { RelatedUser, toRelatedUser } from "../user/user";
import { FormatId } from "./format";

export interface PropertyInfo {
    displayName: string,
    fieldName: string | null,
    id: string,
    optional: boolean,
    semantic: string | null,
    type: Type
}

export interface Enumerator {
    id: string;
    displayName: string;
    fieldName: string | null;
}

function Data() {
    return (fnc: Function) => { };
}

function DataKind() {
    return (target: any, props: string) => { };
}

function DataMember(cstrs: string[]) {
    return (target: any, props: string) => { };
}

@Data()
export class Type {
    @DataKind()
    name: TypeName;

    @DataMember([TypeName.CONTENT, TypeName.ENTITY])
    format?: FormatId;

    @DataMember([TypeName.ARRAY])
    subType?: Type;

    @DataMember([TypeName.CODE])
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
    const res: PropertyInfo = {
        id: prop.entityId,
        displayName: prop.displayName,
        fieldName: prop.fieldName,
        optional: prop.optional,
        semantic: prop.semantic,
        type: new Type({
            name: prop.typeName
        })
    }

    if (prop.typeName == TypeName.ARRAY) {
        Object.assign(res.type, {
            name: prop.argType,
            format: prop.argFormat?.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo)
        });
    } else {
        Object.assign(res.type, {
            format: prop.argFormat?.entityId,
            language: prop.argLanguage,
            properties: prop.argProperties.map(toPropertyInfo),
        });
    }

    return res;
}

export type StructureId = string;

export interface FocusedStructure {
    structureId: StructureId;
    properties: PropertyInfo[];
    createdAt: number;
}

export function toFocusedStructure(structure: Structure): FocusedStructure {
    return {
        structureId: structure.entityId,
        properties: structure.properties.map(toPropertyInfo),
        createdAt: toTimestamp(structure.createdAt)
    };
}
