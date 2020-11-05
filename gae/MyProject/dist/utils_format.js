"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsFormat = void 0;
var UtilsFormat = /** @class */ (function () {
    function UtilsFormat() {
    }
    UtilsFormat.joinProperties = function (query, structureName) {
        return query
            .leftJoinAndSelect(structureName + ".properties", "properties")
            .leftJoinAndSelect("properties.argFormat", "argFormat")
            .leftJoinAndSelect("properties.argProperties", "argProperties")
            .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
            .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
            .leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
            .leftJoinAndSelect("argProperties2.argProperties", "argProperties3");
    };
    return UtilsFormat;
}());
exports.UtilsFormat = UtilsFormat;
//# sourceMappingURL=utils_format.js.map