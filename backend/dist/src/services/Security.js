"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordSecurity = exports.SessionSecurity = void 0;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var util_1 = require("util");
var SessionSecurity = /** @class */ (function () {
    function SessionSecurity() {
    }
    SessionSecurity.verfyToken = function (token) {
        var verified = jwt.verify(token, SessionSecurity.jwtSecret);
        if (util_1.isString(verified)) {
            return parseInt(verified);
        }
        return null;
    };
    SessionSecurity.getToken = function (userId) {
        return jwt.sign(userId.toString(), SessionSecurity.jwtSecret);
    };
    SessionSecurity.jwtSecret = "9099c62b375547b7b34a4485c033bd7eef28a26b928343cb9661da4dbf5482da";
    return SessionSecurity;
}());
exports.SessionSecurity = SessionSecurity;
var PasswordSecurity = /** @class */ (function () {
    function PasswordSecurity() {
    }
    PasswordSecurity.getHash = function (password) {
        return bcrypt.hashSync(password, 10);
    };
    PasswordSecurity.compare = function (password, passwordHash) {
        return bcrypt.compareSync(password, passwordHash);
    };
    return PasswordSecurity;
}());
exports.PasswordSecurity = PasswordSecurity;
//# sourceMappingURL=Security.js.map