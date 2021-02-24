"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRevisionRepository = void 0;
var ContentRevisionQuery_1 = require("../../queries/content/ContentRevisionQuery");
var ContentRevisionRepository = /** @class */ (function () {
    function ContentRevisionRepository(drafts, editings, snapshots, commits) {
        this.drafts = drafts;
        this.editings = editings;
        this.snapshots = snapshots;
        this.commits = commits;
    }
    ContentRevisionRepository.prototype.fromRevisions = function (trx) {
        return new ContentRevisionQuery_1.ContentRivisionQuery(this.drafts.createQuery(trx), this.editings.createQuery(trx), this.snapshots.createQuery(trx), this.commits.createQuery(trx));
    };
    return ContentRevisionRepository;
}());
exports.ContentRevisionRepository = ContentRevisionRepository;
//# sourceMappingURL=ContentRevisionRepository..js.map