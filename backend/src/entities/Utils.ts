import * as crypto from 'crypto';
import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export function DisplayId() {
    return Column("varchar", { length: 15, unique: true });
}

export function EntityId(length = 12) {
    return Column("char", { length, unique: true })
}

export function DisplayName() {
    return Column("varchar", { length: 50 });
}

export function createEntityId(N = 12) {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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

export function DateColumn() {
    return Column({ name: "date", precision: 0, default: () => 'NOW()' })
}