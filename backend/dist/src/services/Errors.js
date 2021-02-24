"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundEntity = exports.WrongTargetState = exports.InternalError = exports.LackOfAuthority = void 0;
var LackOfAuthority = /** @class */ (function () {
    function LackOfAuthority() {
    }
    return LackOfAuthority;
}());
exports.LackOfAuthority = LackOfAuthority;
var InternalError = /** @class */ (function () {
    function InternalError() {
    }
    return InternalError;
}());
exports.InternalError = InternalError;
var WrongTargetState = /** @class */ (function () {
    function WrongTargetState(msg) {
        this.msg = msg;
    }
    return WrongTargetState;
}());
exports.WrongTargetState = WrongTargetState;
var NotFoundEntity = /** @class */ (function () {
    function NotFoundEntity() {
    }
    return NotFoundEntity;
}());
exports.NotFoundEntity = NotFoundEntity;
//# sourceMappingURL=Errors.js.map