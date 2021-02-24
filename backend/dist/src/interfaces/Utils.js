"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimestamp = void 0;
function toTimestamp(date) {
    var milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}
exports.toTimestamp = toTimestamp;
//# sourceMappingURL=Utils.js.map