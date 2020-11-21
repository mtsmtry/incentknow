import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import * as crypto from 'crypto';

export function DisplayId() {
    return Column("varchar", { length: 15, unique: true });
}

export function EntityId(length = 12) {
    return Column("char", { length, unique: true })
}

export function DisplayName() {
    return Column("varchar", { length: 50 });
}

export function createEntityId() {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 12;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('');
}

export function createDisplayId() {
    const S = "0123456789";
    const N = 15;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n) => S[n % S.length]).join('');
}

export function CreatedAt() {
    return CreateDateColumn({ precision: 0, default: () => 'NOW()' })
}

export function UpdatedAt() {
    return UpdateDateColumn({ precision: 0, default: () => 'NOW()' })
}

declare class NewType<T extends string> {
    private IDENTITY: T;
}

export type SurrogateKey<T extends string> = NewType<T> & number;

export type EntityId<T extends string> = NewType<T> & string;