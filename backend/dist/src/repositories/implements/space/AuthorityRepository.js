"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorityRepository = void 0;
var AuthorityQuery_1 = require("../../queries/space/AuthorityQuery");
var AuthorityRepository = /** @class */ (function () {
    function AuthorityRepository(spaces, members, contents, materials) {
        this.spaces = spaces;
        this.members = members;
        this.contents = contents;
        this.materials = materials;
    }
    AuthorityRepository.prototype.fromAuths = function (trx) {
        return new AuthorityQuery_1.AuthorityQuery(this.spaces.createQuery(trx), this.members.createQuery(trx), this.contents.createQuery(trx), this.materials.createQuery(trx));
    };
    return AuthorityRepository;
}());
exports.AuthorityRepository = AuthorityRepository;
//# sourceMappingURL=AuthorityRepository.js.map