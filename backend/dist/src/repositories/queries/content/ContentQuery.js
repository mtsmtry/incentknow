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
exports.ContentQueryFromEntity = exports.ContentQuery = void 0;
var Content_1 = require("../../../interfaces/content/Content");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var ContentQuery = /** @class */ (function (_super) {
    __extends(ContentQuery, _super);
    function ContentQuery(qb) {
        return _super.call(this, qb, ContentQuery) || this;
    }
    ContentQuery.prototype.selectRelated = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser");
        return MappedQuery_1.mapQuery(query, function (x) { return function (f) { return Content_1.toRelatedContent(x, f); }; });
    };
    ContentQuery.prototype.selectFocused = function () {
        var query = this.qb
            .leftJoinAndSelect("creatorUser", "creatorUser")
            .leftJoinAndSelect("updaterUser", "updaterUser")
            .leftJoinAndSelect("materials", "materials")
            .addSelect("data");
        return MappedQuery_1.mapQuery(query, function (x) { return function (f, d) { return Content_1.toFocusedContent(x, d, f); }; });
    };
    return ContentQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.ContentQuery = ContentQuery;
var ContentQueryFromEntity = /** @class */ (function (_super) {
    __extends(ContentQueryFromEntity, _super);
    function ContentQueryFromEntity(content) {
        return _super.call(this, content) || this;
    }
    return ContentQueryFromEntity;
}(SelectQuery_1.SelectQueryFromEntity));
exports.ContentQueryFromEntity = ContentQueryFromEntity;
//# sourceMappingURL=ContentQuery.js.map