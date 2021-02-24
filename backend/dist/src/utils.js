"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapByString = exports.mapBy = exports.groupBy = exports.notNull = void 0;
function notNull(item) {
    return item != null;
}
exports.notNull = notNull;
function groupBy(array, getKey) {
    return array.reduce(function (map, x) {
        var key = getKey(x);
        if (key) {
            (map[key] || (map[key] = [])).push(x);
        }
        return map;
    }, {});
}
exports.groupBy = groupBy;
function mapBy(array, getKey) {
    return array.reduce(function (map, x) {
        var key = getKey(x);
        if (key) {
            map[key] = x;
        }
        return map;
    }, {});
}
exports.mapBy = mapBy;
function mapByString(array, getKey) {
    return array.reduce(function (map, x) {
        var key = getKey(x);
        if (key) {
            map[key] = x;
        }
        return map;
    }, {});
}
exports.mapByString = mapByString;
//# sourceMappingURL=utils.js.map