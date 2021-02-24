"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureQueryFromEntity = exports.StructureQuery = exports.joinProperties = void 0;
var Format_1 = require("../../../interfaces/format/Format");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
function joinProperties(alias, query) {
    return query
        .leftJoinAndSelect(alias + ".properties", "properties")
        .leftJoinAndSelect("properties.argFormat", "argFormat")
        .leftJoinAndSelect("properties.argProperties", "argProperties")
        .leftJoinAndSelect("argProperties.argFormat", "argFormat2")
        .leftJoinAndSelect("argProperties.argProperties", "argProperties2")
        .leftJoinAndSelect("argProperties2.argFormat", "argFormat3")
        .leftJoinAndSelect("argProperties2.argProperties", "argProperties3");
}
exports.joinProperties = joinProperties;
var StructureQuery = /** @class */ (function (_super) {
    __extends(StructureQuery, _super);
    function StructureQuery(qb) {
        return _super.call(this, qb, StructureQuery) || this;
    }
    StructureQuery.prototype.byContent = function (contentId) {
        return new StructureQuery(this.qb.where({ contentId: contentId }));
    };
    StructureQuery.prototype.selectRelated = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");
        return null; // mapQuery(query, toRelatedF);
    };
    StructureQuery.prototype.selectFocusedFormat = function () {
        var query = this.qb
            .leftJoinAndSelect("structure.format", "format")
            .leftJoinAndSelect("format.space", "space")
            .leftJoinAndSelect("format.creatorUser", "creatorUser")
            .leftJoinAndSelect("format.updaterUser", "updaterUser");
        query = joinProperties("x", query);
        return MappedQuery_1.mapQuery(query, Format_1.toFocusedFormatFromStructure);
    };
    return StructureQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.StructureQuery = StructureQuery;
var StructureQueryFromEntity = /** @class */ (function (_super) {
    __extends(StructureQueryFromEntity, _super);
    function StructureQueryFromEntity(Structure) {
        return _super.call(this, Structure) || this;
    }
    return StructureQueryFromEntity;
}(SelectQuery_1.SelectQueryFromEntity));
exports.StructureQueryFromEntity = StructureQueryFromEntity;
//# sourceMappingURL=StructureQuery.js.map