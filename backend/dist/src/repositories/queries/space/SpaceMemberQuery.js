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
exports.SpaceMemberQuery = void 0;
var SpaceMember_1 = require("../../../interfaces/space/SpaceMember");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var SpaceMemberQuery = /** @class */ (function (_super) {
    __extends(SpaceMemberQuery, _super);
    function SpaceMemberQuery(qb) {
        return _super.call(this, qb, SpaceMemberQuery) || this;
    }
    SpaceMemberQuery.prototype.bySpace = function (spaceId) {
        var query = this.qb.where({ spaceId: spaceId });
        return new SpaceMemberQuery(query);
    };
    SpaceMemberQuery.prototype.selectIntact = function () {
        var query = this.qb
            .leftJoinAndSelect("user", "user");
        return MappedQuery_1.mapQuery(query, SpaceMember_1.toIntactSpaceMember);
    };
    return SpaceMemberQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.SpaceMemberQuery = SpaceMemberQuery;
//# sourceMappingURL=SpaceMemberQuery.js.map