"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceSpace = void 0;
var client_sql_1 = require("./client_sql");
var utils_base_1 = require("./utils_base");
var utils_entities_1 = require("./utils_entities");
var utils_authority_1 = require("./utils_authority");
var base = utils_base_1.UtilsBase;
var auth = utils_authority_1.UtilsSpaceAuthorization;
var ServiceSpace = /** @class */ (function () {
    function ServiceSpace() {
    }
    ServiceSpace.createSpace = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, space, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, base.getMyUser()];
                    case 1:
                        user = _a.sent();
                        space = client_sql_1.Space.new(user.id, args.displayName, args.description);
                        return [4 /*yield*/, space.save()];
                    case 2:
                        space = _a.sent();
                        member = client_sql_1.SpaceMember.new(space.id, user.id, client_sql_1.MemberType.OWNER);
                        return [4 /*yield*/, member.save()];
                    case 3:
                        member = _a.sent();
                        return [2 /*return*/, space];
                }
            });
        });
    };
    ServiceSpace.getSpace = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, space;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            // get user
                            base.getMyUser(),
                            // get space
                            base.conn.getRepository(client_sql_1.Space)
                                .createQueryBuilder("space")
                                .leftJoinAndSelect("space.creatorUser", "creatorUser")
                                .where("space.displayId = :displayId")
                                .setParameters({ displayId: args.spaceDisplayId })
                                .getOne()
                        ])];
                    case 1:
                        _a = _b.sent(), user = _a[0], space = _a[1];
                        return [4 /*yield*/, auth.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.VISIBLE)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, utils_entities_1.toFocusedSpace(space)];
                }
            });
        });
    };
    ServiceSpace.getSpaceMembers = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, space, members;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            // get user
                            base.getMyUser(),
                            // get space for space.defaultAuthprity
                            client_sql_1.Space.findOne({ entityId: args.spaceId }),
                            // get members
                            client_sql_1.SpaceMember
                                .createQueryBuilder("member")
                                .leftJoin("member.space", "space")
                                .leftJoinAndSelect("member.user", "user")
                                .where("space.entityId = :spaceId")
                                .setParameters({ spaceId: args.spaceId })
                                .getMany()
                        ])];
                    case 1:
                        _a = _b.sent(), user = _a[0], space = _a[1], members = _a[2];
                        return [4 /*yield*/, auth.checkSpaceAuth(user, space, client_sql_1.SpaceAuth.VISIBLE)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, members];
                }
            });
        });
    };
    return ServiceSpace;
}());
exports.ServiceSpace = ServiceSpace;
//# sourceMappingURL=service_space.js.map