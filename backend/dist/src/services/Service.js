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
exports.Service = void 0;
var Container_1 = require("../entities/container/Container");
var Content_1 = require("../entities/content/Content");
var ContentCommit_1 = require("../entities/content/ContentCommit");
var ContentDraft_1 = require("../entities/content/ContentDraft");
var ContentEditing_1 = require("../entities/content/ContentEditing");
var ContentSnapshot_1 = require("../entities/content/ContentSnapshot");
var Format_1 = require("../entities/format/Format");
var Property_1 = require("../entities/format/Property");
var Structure_1 = require("../entities/format/Structure");
var Material_1 = require("../entities/material/Material");
var MaterialCommit_1 = require("../entities/material/MaterialCommit");
var MaterialDraft_1 = require("../entities/material/MaterialDraft");
var MaterialEditing_1 = require("../entities/material/MaterialEditing");
var MaterialSnapshot_1 = require("../entities/material/MaterialSnapshot");
var Space_1 = require("../entities/space/Space");
var SpaceFollow_1 = require("../entities/space/SpaceFollow");
var SpaceMember_1 = require("../entities/space/SpaceMember");
var SpaceMembershipApplication_1 = require("../entities/space/SpaceMembershipApplication");
var User_1 = require("../entities/user/User");
var ContainerRepository_1 = require("../repositories/implements/container/ContainerRepository");
var ContentCommitRepository_1 = require("../repositories/implements/content/ContentCommitRepository");
var ContentEditingRepository_1 = require("../repositories/implements/content/ContentEditingRepository");
var ContentRepository_1 = require("../repositories/implements/content/ContentRepository.");
var ContentRevisionRepository_1 = require("../repositories/implements/content/ContentRevisionRepository.");
var ContentWholeRepository_1 = require("../repositories/implements/content/ContentWholeRepository");
var FormatRepository_1 = require("../repositories/implements/format/FormatRepository");
var MaterialCommitRepository_1 = require("../repositories/implements/material/MaterialCommitRepository");
var MaterialEditingRepository_1 = require("../repositories/implements/material/MaterialEditingRepository");
var MaterialRepository_1 = require("../repositories/implements/material/MaterialRepository");
var MaterialRevisionRepository_1 = require("../repositories/implements/material/MaterialRevisionRepository");
var AuthorityRepository_1 = require("../repositories/implements/space/AuthorityRepository");
var SpaceRepository_1 = require("../repositories/implements/space/SpaceRepository");
var UserDto_1 = require("../repositories/implements/user/UserDto");
var Repository_1 = require("../repositories/Repository");
var BaseService_1 = require("./BaseService");
var ContainerService_1 = require("./implements/ContainerService");
var ContentService_1 = require("./implements/ContentService");
var FormatService_1 = require("./implements/FormatService");
var MaterialService_1 = require("./implements/MaterialService");
var SpaceService_1 = require("./implements/SpaceService");
var UserService_1 = require("./implements/UserService");
function createRepository(conn, trg) {
    return new Repository_1.Repository(conn, conn.getMetadata(trg));
}
var Service = /** @class */ (function (_super) {
    __extends(Service, _super);
    function Service(ctx) {
        var _this = _super.call(this, ctx) || this;
        var conn = ctx.conn;
        var container = new ContainerRepository_1.ContainerRepository(createRepository(conn, Container_1.Container));
        var conCom = new ContentCommitRepository_1.ContentCommitRepository(createRepository(conn, ContentCommit_1.ContentCommit));
        var conRev = new ContentRevisionRepository_1.ContentRevisionRepository(createRepository(conn, ContentDraft_1.ContentDraft), createRepository(conn, ContentEditing_1.ContentEditing), createRepository(conn, ContentSnapshot_1.ContentSnapshot), createRepository(conn, ContentCommit_1.ContentCommit));
        var conEdit = new ContentEditingRepository_1.ContentEditingRepository(createRepository(conn, ContentDraft_1.ContentDraft), createRepository(conn, ContentEditing_1.ContentEditing), createRepository(conn, ContentSnapshot_1.ContentSnapshot));
        var con = new ContentRepository_1.ContentRepository(createRepository(conn, Content_1.Content));
        var mat = new MaterialRepository_1.MaterialRepository(createRepository(conn, Material_1.Material));
        var conWhole = new ContentWholeRepository_1.ContentWholeRepository(con, mat);
        var format = new FormatRepository_1.FormatRepository(createRepository(conn, Format_1.Format), createRepository(conn, Structure_1.Structure), createRepository(conn, Property_1.Property));
        var matCom = new MaterialCommitRepository_1.MaterialCommitRepository(createRepository(conn, MaterialCommit_1.MaterialCommit));
        var matEdit = new MaterialEditingRepository_1.MaterialEditingRepository(createRepository(conn, MaterialDraft_1.MaterialDraft), createRepository(conn, MaterialEditing_1.MaterialEditing), createRepository(conn, MaterialSnapshot_1.MaterialSnapshot));
        var matRev = new MaterialRevisionRepository_1.MaterialRevisionRepository(createRepository(conn, MaterialDraft_1.MaterialDraft), createRepository(conn, MaterialEditing_1.MaterialEditing), createRepository(conn, MaterialSnapshot_1.MaterialSnapshot), createRepository(conn, MaterialCommit_1.MaterialCommit));
        var auth = new AuthorityRepository_1.AuthorityRepository(createRepository(conn, Space_1.Space), createRepository(conn, SpaceMember_1.SpaceMember), createRepository(conn, Content_1.Content), createRepository(conn, Material_1.Material));
        var space = new SpaceRepository_1.SpaceRepository(createRepository(conn, Space_1.Space), createRepository(conn, SpaceMember_1.SpaceMember), createRepository(conn, SpaceMembershipApplication_1.SpaceMembershipApplication), createRepository(conn, SpaceFollow_1.SpaceFollow));
        var user = new UserDto_1.UserRepository(createRepository(conn, User_1.User));
        _this.containerService = new ContainerService_1.ContainerService(ctx, container, auth);
        _this.contentService = new ContentService_1.ContentService(ctx, con, conEdit, conCom, conRev, mat, matEdit, matRev, space, container, format, auth);
        _this.formatService = new FormatService_1.FormatService(ctx, format, auth);
        _this.materialService = new MaterialService_1.MaterialService(ctx, mat, matEdit, matRev, matCom, con, conEdit, space, auth);
        _this.spaceService = new SpaceService_1.SpaceService(ctx, space, user, auth);
        _this.userService = new UserService_1.UserService(ctx, user, auth);
        _this.services = [
            _this.containerService,
            _this.contentService,
            _this.formatService,
            _this.materialService,
            _this.spaceService,
            _this.userService
        ];
        return _this;
    }
    Service.prototype.execute = function (methodName, args) {
        return __awaiter(this, void 0, void 0, function () {
            var method;
            return __generator(this, function (_a) {
                method = null;
                this.services.forEach(function (service) {
                    if (method) {
                        return method;
                    }
                    method = service.execute(methodName, args);
                });
                if (!method) {
                    throw "The method does not exist";
                }
                return [2 /*return*/, method];
            });
        });
    };
    return Service;
}(BaseService_1.BaseService));
exports.Service = Service;
//# sourceMappingURL=Service.js.map