"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContext = void 0;
var util_1 = require("util");
var Transaction_1 = require("../repositories/Transaction");
var Errors_1 = require("./Errors");
var Security_1 = require("./Security");
var ServiceContext = /** @class */ (function () {
    function ServiceContext(conn) {
        this.conn = conn;
        this.userId = null;
    }
    ServiceContext.prototype.setHeaders = function (headers) {
        var session = headers["session"];
        if (util_1.isString(session)) {
            this.userId = Security_1.SessionSecurity.verfyToken(session);
        }
    };
    ServiceContext.prototype.getAuthorized = function () {
        if (!this.userId) {
            throw new Errors_1.LackOfAuthority();
        }
        return this.userId;
    };
    ServiceContext.prototype.transaction = function (runInTransaction) {
        return Transaction_1.Transaction.transaction(this.conn, runInTransaction);
    };
    ServiceContext.prototype.transactionAuthorized = function (runInTransaction) {
        var userId = this.getAuthorized();
        return Transaction_1.Transaction.transaction(this.conn, function (trx) { return runInTransaction(trx, userId); });
    };
    return ServiceContext;
}());
exports.ServiceContext = ServiceContext;
//# sourceMappingURL=ServiceContext.js.map