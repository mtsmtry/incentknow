import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";
import { PropertyInfo, toFocusedFormat, toFocusedFormatFromStructure } from './utils_entities';
import { Connection, createConnection, SelectQueryBuilder } from 'typeorm';

export class UtilsFormat {

    static joinProperties<T>(query: SelectQueryBuilder<T>, structureName: string): SelectQueryBuilder<T> {
        return query
            .leftJoinAndSelect(structureName + ".properties", "properties")
            .leftJoinAndSelect("properties.argFormat", "argFormat")
            .leftJoinAndSelect("properties.argProperties", "argProperties")
            .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
            .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
            .leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
            .leftJoinAndSelect("argProperties2.argProperties", "argProperties3");
    }
}