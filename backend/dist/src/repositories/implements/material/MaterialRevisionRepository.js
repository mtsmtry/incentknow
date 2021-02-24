"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialRevisionRepository = void 0;
var MaterialNodeQuery_1 = require("../../queries/material/MaterialNodeQuery");
var MaterialRevisionQuery_1 = require("../../queries/material/MaterialRevisionQuery");
var MaterialRevisionRepository = /** @class */ (function () {
    function MaterialRevisionRepository(drafts, editings, snapshots, commits) {
        this.drafts = drafts;
        this.editings = editings;
        this.snapshots = snapshots;
        this.commits = commits;
    }
    MaterialRevisionRepository.prototype.fromNodes = function (trx) {
        return new MaterialNodeQuery_1.MaterialNodeQuery(this.commits.createQuery(trx), this.editings.createQuery(trx));
    };
    MaterialRevisionRepository.prototype.fromRevisions = function (trx) {
        return new MaterialRevisionQuery_1.MaterialRivisionQuery(this.drafts.createQuery(trx), this.editings.createQuery(trx), this.snapshots.createQuery(trx), this.commits.createQuery(trx));
    };
    return MaterialRevisionRepository;
}());
exports.MaterialRevisionRepository = MaterialRevisionRepository;
//# sourceMappingURL=MaterialRevisionRepository.js.map