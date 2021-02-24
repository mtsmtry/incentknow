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
exports.UserQueryFromEntity = exports.UserQuery = void 0;
var User_1 = require("../../../interfaces/user/User");
var MappedQuery_1 = require("../MappedQuery");
var SelectQuery_1 = require("../SelectQuery");
var UserQuery = /** @class */ (function (_super) {
    __extends(UserQuery, _super);
    function UserQuery(qb) {
        return _super.call(this, qb, UserQuery) || this;
    }
    UserQuery.prototype.byEmail = function (email) {
        var query = this.qb.where({ email: email });
        return new UserQuery(query);
    };
    UserQuery.prototype.selectRelated = function () {
        var query = this.qb;
        return MappedQuery_1.mapQuery(query, User_1.toRelatedUser);
    };
    UserQuery.prototype.selectFocused = function () {
        var query = this.qb;
        return MappedQuery_1.mapQuery(query, User_1.toFocusedUser);
    };
    UserQuery.prototype.selectIntactAccount = function () {
        var query = this.qb;
        return MappedQuery_1.mapQuery(query, User_1.toIntactAccount);
    };
    return UserQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.UserQuery = UserQuery;
var UserQueryFromEntity = /** @class */ (function (_super) {
    __extends(UserQueryFromEntity, _super);
    function UserQueryFromEntity(user) {
        return _super.call(this, user) || this;
    }
    return UserQueryFromEntity;
}(SelectQuery_1.SelectQueryFromEntity));
exports.UserQueryFromEntity = UserQueryFromEntity;
//# sourceMappingURL=UserQuery.js.map