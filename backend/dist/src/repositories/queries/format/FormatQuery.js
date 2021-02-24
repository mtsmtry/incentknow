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
exports.FormatQueryFromEntity = exports.FormatQuery = void 0;
var Format_1 = require("../../../interfaces/format/Format");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var StructureQuery_1 = require("./StructureQuery");
var FormatQuery = /** @class */ (function (_super) {
    __extends(FormatQuery, _super);
    function FormatQuery(qb) {
        return _super.call(this, qb, FormatQuery) || this;
    }
    FormatQuery.prototype.bySpace = function (spaceId) {
        return new FormatQuery(this.qb.where({ spaceId: spaceId }));
    };
    FormatQuery.prototype.selectRelated = function () {
        var query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");
        return MappedQuery_1.mapQuery(query, Format_1.toRelatedFormat);
    };
    FormatQuery.prototype.selectFocused = function () {
        var query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .leftJoinAndSelect("currentStructure", "currentStructure");
        var query2 = StructureQuery_1.joinProperties("currentStructure", query);
        return MappedQuery_1.mapQuery(query2, Format_1.toFocusedFormat);
    };
    return FormatQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.FormatQuery = FormatQuery;
var FormatQueryFromEntity = /** @class */ (function (_super) {
    __extends(FormatQueryFromEntity, _super);
    function FormatQueryFromEntity(Format) {
        return _super.call(this, Format) || this;
    }
    return FormatQueryFromEntity;
}(SelectQuery_1.SelectQueryFromEntity));
exports.FormatQueryFromEntity = FormatQueryFromEntity;
//# sourceMappingURL=FormatQuery.js.map