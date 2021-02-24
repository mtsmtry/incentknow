"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
var util_1 = require("util");
var BaseService = /** @class */ (function () {
    function BaseService(ctx) {
        this.ctx = ctx;
    }
    BaseService.prototype.execute = function (methodName, args) {
        if (methodName.startsWith("_")) {
            return null;
        }
        var method = this[methodName];
        if (!method || !util_1.isFunction(method)) {
            return null;
        }
        return method.apply(void 0, args);
    };
    return BaseService;
}());
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map