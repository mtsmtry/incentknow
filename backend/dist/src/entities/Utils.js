"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateColumn = exports.UpdatedAt = exports.CreatedAt = exports.createDisplayId = exports.createEntityId = exports.DisplayName = exports.EntityId = exports.DisplayId = void 0;
var crypto = require("crypto");
var typeorm_1 = require("typeorm");
function DisplayId() {
    return typeorm_1.Column("varchar", { length: 15, unique: true });
}
exports.DisplayId = DisplayId;
function EntityId(length) {
    if (length === void 0) { length = 12; }
    return typeorm_1.Column("char", { length: length, unique: true });
}
exports.EntityId = EntityId;
function DisplayName() {
    return typeorm_1.Column("varchar", { length: 50 });
}
exports.DisplayName = DisplayName;
function createEntityId() {
    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var N = 12;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map(function (n) { return S[n % S.length]; }).join('');
}
exports.createEntityId = createEntityId;
function createDisplayId() {
    var S = "0123456789";
    var N = 15;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map(function (n) { return S[n % S.length]; }).join('');
}
exports.createDisplayId = createDisplayId;
function CreatedAt() {
    return typeorm_1.CreateDateColumn({ precision: 0, default: function () { return 'NOW()'; } });
}
exports.CreatedAt = CreatedAt;
function UpdatedAt() {
    return typeorm_1.UpdateDateColumn({ precision: 0, default: function () { return 'NOW()'; } });
}
exports.UpdatedAt = UpdatedAt;
function DateColumn() {
    return typeorm_1.Column({ name: "date", precision: 0, default: function () { return 'NOW()'; } });
}
exports.DateColumn = DateColumn;
//# sourceMappingURL=Utils.js.map