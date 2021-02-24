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
exports.MaterialEditingQuery = void 0;
var SelectQuery_1 = require("../SelectQuery");
var MaterialEditingQuery = /** @class */ (function (_super) {
    __extends(MaterialEditingQuery, _super);
    function MaterialEditingQuery(qb) {
        return _super.call(this, qb, MaterialEditingQuery) || this;
    }
    return MaterialEditingQuery;
}(SelectQuery_1.SelectFromSingleTableQuery));
exports.MaterialEditingQuery = MaterialEditingQuery;
//# sourceMappingURL=MaterialEditingQuery.js.map