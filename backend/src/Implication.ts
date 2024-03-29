import { Express } from "express";

export function Data() {
    return (fnc: Function) => { };
}

export function DataKind() {
    return (target: any, props: string) => { };
}

export function DataMember(cstrs: string[]) {
    return (target: any, props: string) => { };
}

class NewTypeIdentity<T extends string> {
    private IDENTITY: T;
}

type NewType<T, Identity extends string> = NewTypeIdentity<Identity> & T;

export type Int = number;

export type Blob = Express.Multer.File;

export type NewTypeInt<Identity extends string> = NewType<number, Identity>;

export type NewTypeString<Identity extends string> = NewType<string, Identity>;