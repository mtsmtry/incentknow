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
exports.ContainerQuery = void 0;
var Container_1 = require("../../../interfaces/container/Container");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var ContainerQuery = /** @class */ (function (_super) {
    __extends(ContainerQuery, _super);
    function ContainerQuery(qb) {
        return _super.call(this, qb, ContainerQuery) || this;
    }
    ContainerQuery.prototype.bySpace = function (spaceId) {
        return new ContainerQuery(this.qb.where({ spaceId: spaceId }));
    };
    ContainerQuery.prototype.bySpaceAndFormat = function (spaceId, formatId) {
        return new ContainerQuery(this.qb.where({ spaceId: spaceId, formatId: formatId }));
    };
    ContainerQuery.prototype.selectRelated = function () {
        var query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("format", "format");
        return MappedQuery_1.mapQuery(query, Container_1.toRelatedContainer);
    };
    ContainerQuery.prototype.selectFocused = function () {
        var query = this.qb
            .leftJoinAndSelect("space", "space")
            .leftJoinAndSelect("format", "format");
        return MappedQuery_1.mapQuery(query, function (x) { return function (r) { return Container_1.toFocusedContainer(x, r); }; });
    };
    return ContainerQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.ContainerQuery = ContainerQuery;
//# sourceMappingURL=ContainerQuery.js.map