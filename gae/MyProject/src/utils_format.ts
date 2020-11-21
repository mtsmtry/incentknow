import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { PropertyInfo, toFocusedFormat, toFocusedFormatFromStructure, Type } from './utils_entities';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';

export function joinProperties<T>(query: SelectQueryBuilder<T>, structureName: string): SelectQueryBuilder<T> {
    return query
        .leftJoinAndSelect(structureName + ".properties", "properties")
        .leftJoinAndSelect("properties.argFormat", "argFormat")
        .leftJoinAndSelect("properties.argProperties", "argProperties")
        .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
        .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
        .leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
        .leftJoinAndSelect("argProperties2.argProperties", "argProperties3");
}

function toMap<T, TValue>(array: T[], getKey: (x: T) => string, getValue: (x: T) => TValue) {
    return array.reduce((m: { [key: string]: TValue }, x) => {
        m[getKey(x)] = getValue(x);
        return m;
    }, {})
}

export function getContentObject(content: any, props: PropertyInfo[]) {
    function mkValue(value: any, type: Type): any {
        if (value === undefined || value === null) {
            return null;
        } else if (type.name == TypeName.OBJECT) {
            return mkObject(value, type.properties);
        } else if (type.name == TypeName.ARRAY) {
            return value.map((item: any) => mkValue(item, type.subType));
        } else {
            return value;
        }
    }

    function mkObject(data: any, props: PropertyInfo[]) {
        return toMap(props, x => x.fieldName || x.id, x => mkValue(data[x.id], x.type));
    }

    return mkObject(content, props);
}

export function getContentData(obj: any, props: PropertyInfo[]) {
    function mkValue(value: any, type: Type): any {
        if (value === undefined || value === null) {
            return null;
        } else if (type.name == "object") {
            return mkObject(value, type.properties);
        } else if (type.name == "array") {
            return value.map((item: any) => mkValue(item, type.subType));
        } else {
            return value;
        }
    }

    function mkObject(data: any, properties: PropertyInfo[]) {
        return toMap(properties, x => x.id, x => mkValue(data[x.fieldName || x.id], x.type));
    }

    return mkObject(obj, props);
}