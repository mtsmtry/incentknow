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
exports.MaterialQueryFromEntity = exports.MaterialQuery = void 0;
var Material_1 = require("../../../interfaces/material/Material");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var MaterialQuery = /** @class */ (function (_super) {
    __extends(MaterialQuery, _super);
    function MaterialQuery(qb) {
        return _super.call(this, qb, MaterialQuery) || this;
    }
    MaterialQuery.prototype.byContent = function (contentId) {
        return new MaterialQuery(this.qb.where({ contentId: contentId }));
    };
    MaterialQuery.prototype.selectRelated = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");
        return MappedQuery_1.mapQuery(query, Material_1.toRelatedMaterial);
    };
    MaterialQuery.prototype.selectFocused = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .addSelect("data");
        return MappedQuery_1.mapQuery(query, function (x) { return function (d) { return Material_1.toFocusedMaterial(x, d); }; });
    };
    return MaterialQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.MaterialQuery = MaterialQuery;
var MaterialQueryFromEntity = /** @class */ (function (_super) {
    __extends(MaterialQueryFromEntity, _super);
    function MaterialQueryFromEntity(material) {
        return _super.call(this, material) || this;
    }
    return MaterialQueryFromEntity;
}(SelectQuery_1.SelectQueryFromEntity));
exports.MaterialQueryFromEntity = MaterialQueryFromEntity;
//# sourceMappingURL=MaterialQuery.js.map