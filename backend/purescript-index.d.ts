import * as DB from './../client';

export namespace PS {
    export function getStructureChangeType(args: { before: DB.Property[], after: DB.Property[] }): string;
    export function validateContentObject(args: { props: DB.Property[], data: DB.Data }): string[];
    export function validateContentData(args: { props: DB.Property[], data: DB.Data }): string[];
    export function normalizeStructure(props: DB.Property[]): DB.Property[];
    export function getMaxLargeIndex(props: DB.Property[]): number;
    export function getContentIndexes(args: { props: DB.Property[], data: DB.Data }): DB.Indexes;
    export function getStructureRelations(props: DB.Property[]): string[];
}
