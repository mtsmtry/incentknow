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
exports.SpaceQueryFromEntity = exports.SpaceQuery = void 0;
var Space_1 = require("../../../interfaces/space/Space");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var SpaceQuery = /** @class */ (function (_super) {
    __extends(SpaceQuery, _super);
    function SpaceQuery(qb) {
        return _super.call(this, qb, SpaceQuery) || this;
    }
    SpaceQuery.prototype.byFollower = function (userId) {
        var query = this.qb.leftJoin("followers", "f").where("f.id = :userId", { userId: userId });
        return new SpaceQuery(query);
    };
    SpaceQuery.prototype.byPublished = function () {
        var query = this.qb.where({ published: true });
        return new SpaceQuery(query);
    };
    SpaceQuery.prototype.selectRelated = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");
        return MappedQuery_1.mapQuery(query, Space_1.toRelatedSpace);
    };
    SpaceQuery.prototype.selectFocused = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");
        return MappedQuery_1.mapQuery(query, Space_1.toFocusedSpace);
    };
    return SpaceQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.SpaceQuery = SpaceQuery;
var SpaceQueryFromEntity = /** @class */ (function (_super) {
    __extends(SpaceQueryFromEntity, _super);
    function SpaceQueryFromEntity(material) {
        return _super.call(this, material) || this;
    }
    return SpaceQueryFromEntity;
}(SelectQuery_1.SelectQueryFromEntity));
exports.SpaceQueryFromEntity = SpaceQueryFromEntity;
//# sourceMappingURL=SpaceQuery.js.map