"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMaterialNodes = exports.MaterialNodeType = void 0;
var MaterialEditing_1 = require("../../entities/material/MaterialEditing");
var utils_1 = require("../../utils");
var User_1 = require("../user/User");
var MaterialRevision_1 = require("./MaterialRevision");
// [基本的な履歴管理の説明]
// Content/MaterialとCommitのデータ部分をSnapshotに統合することは可能ですが、
// 以下の三層を疎結合にするために、分離する設計を取っていいます。
//      [実データ層] Content/Material
//      [編集履歴層] Commit
//      [個人編集層]
//          Draft: 永続的な編集の記録。
//          Editing: 個人的な編集の単位。
//          Snapshot: 個人的な変更されることのないデータ。何かのEditingに属する。
// 1. 実データ層と編集履歴層を分離することで、実体の種類によって編集履歴機能を有効にするかを、設定できるようにできます。
//      ユースケース1) 外部からの大量なデータのインポート時に、編集履歴機能を使用しないことで高速化できる
//      ユースケース2) リアルタイム共同編集機能がオンの時に、直接データを取得する
// 2. 編集履歴層と個人編集層を分離することで、一定期間が経過した個人編集層のデータを削除することができます。
//      例えば、CommitとSnapshotが統合されていれば、タイムスタンプでパーティショニングを行い、古いパーティションテーブルごと削除するといったことはできません。
// [履歴表示戦略の説明]
// ユーザー側からは、前述の三層の区別は隠蔽されます。
// ユーザーがバージョンを参照する際に必要な概念は以下の二つのみです。
// 1. Node
//      Nodeは、編集の単位であり、一連の編集プロセスを示します。
//      Nodeは、子要素として複数のSnapshotを持ちますが、Node自体もSnapshotの具象です。
//      全てのCommit, Commitしていない全てのEditing, DraftからNodeは生成されます。
// 2. Snapshot (RDBのSnapshotとは異なります)
//      タイムスタンプ、データ、作成者のみを示すシンプルなものです。
//      Commit, Draft, Snapshotから生成されます。
var MaterialNodeType;
(function (MaterialNodeType) {
    MaterialNodeType["COMMITTED"] = "committed";
    MaterialNodeType["PRESENT"] = "present";
    MaterialNodeType["CANCELD"] = "canceled";
})(MaterialNodeType = exports.MaterialNodeType || (exports.MaterialNodeType = {}));
function toNodeTypeFromEditingState(state) {
    switch (state) {
        case MaterialEditing_1.MaterialEditingState.CANCELD:
            return MaterialNodeType.CANCELD;
        case MaterialEditing_1.MaterialEditingState.EDITING:
            return MaterialNodeType.PRESENT;
        case MaterialEditing_1.MaterialEditingState.COMMITTED:
            return null;
    }
}
function toMaterialNodes(editings, commits) {
    var editingDict = editings.reduce(function (prev, x) { return prev[x.id] = x; }, {});
    function fromEditing(editing) {
        var type = toNodeTypeFromEditingState(editing.state);
        if (!type) {
            return null;
        }
        return {
            type: type,
            user: User_1.toRelatedUser(editing.user),
            editingId: editing.entityId,
            revision: MaterialRevision_1.toRelatedMaterialRevisionFromEditing(editing)
        };
    }
    function fromCommit(commit) {
        var _a;
        return {
            type: MaterialNodeType.COMMITTED,
            user: User_1.toRelatedUser(commit.committerUser),
            editingId: commit.editingId ? (_a = editingDict[commit.editingId]) === null || _a === void 0 ? void 0 : _a.entityId : null,
            revision: MaterialRevision_1.toRelatedMaterialRevisionFromCommit(commit)
        };
    }
    return editings.map(fromEditing).filter(utils_1.notNull).concat(commits.map(fromCommit));
}
exports.toMaterialNodes = toMaterialNodes;
//# sourceMappingURL=MaterialNode.js.map