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
exports.SpaceMemberApplicationQuery = void 0;
var SpaceMembershipApplication_1 = require("../../../interfaces/space/SpaceMembershipApplication");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var SpaceMemberApplicationQuery = /** @class */ (function (_super) {
    __extends(SpaceMemberApplicationQuery, _super);
    function SpaceMemberApplicationQuery(qb) {
        return _super.call(this, qb, SpaceMemberApplicationQuery) || this;
    }
    SpaceMemberApplicationQuery.prototype.bySpace = function (spaceId) {
        var query = this.qb.where({ spaceId: spaceId });
        return new SpaceMemberApplicationQuery(query);
    };
    SpaceMemberApplicationQuery.prototype.byUser = function (userId) {
        var query = this.qb.where({ userId: userId });
        return new SpaceMemberApplicationQuery(query);
    };
    SpaceMemberApplicationQuery.prototype.selectIntact = function () {
        var query = this.qb
            .leftJoinAndSelect("user", "user");
        return MappedQuery_1.mapQuery(query, SpaceMembershipApplication_1.toIntactSpaceMembershipApplication);
    };
    return SpaceMemberApplicationQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.SpaceMemberApplicationQuery = SpaceMemberApplicationQuery;
//# sourceMappingURL=SpaceMembershipApplicationQuery.js.map