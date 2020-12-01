"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.failedCrawlingTask = exports.completeCrawlingTask = exports.beginCrawlingTask = exports.runCrawler = exports.createCrawler = exports.updateFormatStructure = exports.getContentsByReactor = exports.getContentBySemanticId = exports.setReactorDefinitionId = exports.setContentGenerator = exports.setSpaceMembershipMethod = exports.cancelSpaceMembershipApplication = exports.rejectSpaceMembership = exports.acceptSpaceMembership = exports.applySpaceMembership = exports.setFormatCollectionPage = exports.setFormatContentPage = exports.setSpaceDisplayId = exports.setSpaceAuthority = exports.setSpacePublished = exports.setSpaceHomeImage = exports.setSpaceDisplayName = exports.setMyIcon = exports.setMyDisplayName = exports.deleteWork = exports.createBlankWork = exports.updateBlankWork = exports.writeContentWork = exports.commitContent = exports.createContent = exports.createFormat = exports.createSpace = exports.checkSpaceDisplayId = exports.createUser = void 0;
var firebase_functions = require("firebase-functions");
var querystring_1 = require("querystring");
var crypto = require("crypto");
var pubsub_1 = require("@google-cloud/pubsub");
var DB = require("./client_sql");
var axios_1 = require("axios");
var functions = firebase_functions.region("asia-northeast1");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
var purescript_index_js_1 = require("../purescript-index.js");
var ref = new DB.Reference();
var pubsub = new pubsub_1.PubSub({ projectId: "incentknow" });
var crawlingTopic = pubsub.topic("projects/incentknow/topics/crawling");
function timestamp() {
    var date = new Date();
    var milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}
function timestampMilliseconds() {
    var date = new Date();
    return date.getTime();
}
function genId() {
    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var N = 12;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map(function (n) { return S[n % S.length]; }).join('');
}
function genRandom1000() {
    var S = "0123456789";
    var N = 4;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map(function (n) { return S[n % S.length]; }).join('');
}
function genTimeId() {
    return timestampMilliseconds().toString() + genRandom1000().toString();
}
var BadRequest = /** @class */ (function () {
    function BadRequest(error) {
        this.error = error;
    }
    return BadRequest;
}());
var NotExists = /** @class */ (function (_super) {
    __extends(NotExists, _super);
    function NotExists(type) {
        return _super.call(this, "この" + type + "は存在しません") || this;
    }
    return NotExists;
}(BadRequest));
var BatchUsersError = /** @class */ (function () {
    function BatchUsersError(error) {
        this.error = error;
    }
    return BatchUsersError;
}());
function onCall(handler) {
    function handler2(data, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, handler(data, context)];
                }
                catch (e) {
                    if (e instanceof BadRequest) {
                        return [2 /*return*/, { error: e.error }];
                    }
                    else {
                        throw e;
                    }
                }
                return [2 /*return*/];
            });
        });
    }
    return functions.https.onCall(handler2);
}
function toMap(array, getKey, getValue) {
    return array.reduce(function (m, x) {
        m[getKey(x)] = getValue(x);
        return m;
    }, {});
}
function isLogined(auth) {
    if (!auth) {
        throw new BadRequest("ログインしてください");
    }
    return true;
}
function createSnapshot(batch, workRef, workingChangeId, snapshot) {
    // changeを作成もしくは更新
    var changeRef;
    var changeId;
    var time = timestamp();
    if (!workingChangeId) {
        changeId = genId();
        changeRef = workRef.changes.doc(changeId);
        var change = {
            createdAt: time,
            updatedAt: time
        };
        batch.create(changeRef, change);
    }
    else {
        changeId = workingChangeId;
        changeRef = workRef.changes.doc(changeId);
        var change = {
            updatedAt: time
        };
        batch.update(changeRef, change);
    }
    // snapshotを作成
    var snapshotId = genTimeId();
    var snapshotRef = changeRef.snapshots.doc(snapshotId);
    batch.create(snapshotRef, snapshot);
    return changeId;
}
function mkNewWork(spec, formatId, structureId, data) {
    var time = timestamp();
    var work = {
        createdAt: time,
        updatedAt: time,
        formatId: formatId,
        structureId: structureId,
        data: data,
        change: "initial",
        state: "working",
        workingChangeId: null,
        contentId: spec.workType == "content" ? spec.contentId : null,
        spaceId: spec.workType == "blank" ? spec.spaceId : null,
    };
    return work;
}
function _createSpace(batch, data, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var spaceId, time, space, member, userSpace, spaceRef, memberRef, userSpaceRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _checkSpaceDisplayId(data.displayId)];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, { error: "このIDは既に存在します" }];
                    }
                    spaceId = genId();
                    time = timestamp();
                    space = {
                        displayName: data.displayName,
                        displayId: data.displayId,
                        description: data.description,
                        formatCount: 0,
                        memberCount: 1,
                        committerCount: 0,
                        creatorUserId: userId,
                        createdAt: time,
                        homeUrl: null,
                        published: false,
                        authority: { base: "none" },
                        membershipMethod: "none"
                    };
                    member = {
                        joinedAt: time,
                        appliedAt: null,
                        type: "owner"
                    };
                    userSpace = {
                        type: "membership",
                        createdAt: time
                    };
                    spaceRef = ref.spaces.doc(spaceId);
                    memberRef = spaceRef.members.doc(userId);
                    userSpaceRef = ref.users.doc(userId).followingSpaces.doc(spaceId);
                    batch.create(memberRef, member);
                    batch.create(spaceRef, space);
                    batch.create(userSpaceRef, userSpace);
                    return [2 /*return*/, spaceId];
            }
        });
    });
}
function getChangeType(prevLength, length) {
    // 文字数で変更の種類を分類
    if (prevLength < length) {
        return "increase";
    }
    else if (prevLength > length) {
        return "decrease";
    }
    else {
        return "complex";
    }
}
function writeWork(args) {
    return __awaiter(this, void 0, void 0, function () {
        var workRef, batch, time, prevWork, work, prevText, text, work, snapshot, changeId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workRef = ref.users.doc(args.userId).works.doc(args.workId);
                    batch = new DB.Batch();
                    time = timestamp();
                    return [4 /*yield*/, workRef.get()];
                case 1:
                    prevWork = (_a.sent()).data();
                    if (!prevWork) {
                        if (args.spec.workType == "content") {
                            work = mkNewWork(args.spec, args.formatId, args.structureId, args.data);
                            batch.create(workRef, work);
                        }
                        else {
                            return [2 /*return*/, { error: "このWorkIdは存在しません" }];
                        }
                    }
                    else {
                        prevText = querystring_1.stringify(prevWork.data);
                        text = querystring_1.stringify(args.data);
                        if (prevText != text) {
                            work = {
                                updatedAt: time,
                                data: args.data,
                                change: getChangeType(prevText.length, text.length),
                                state: "working",
                                contentId: args.spec.workType == "content" ? args.spec.contentId : null,
                                spaceId: args.spec.workType == "blank" ? args.spec.spaceId : null,
                                formatId: args.formatId
                            };
                            if (prevWork.change != "decrease" && work.change == "decrease") {
                                snapshot = {
                                    data: prevWork.data,
                                    timestamp: prevWork.updatedAt,
                                    formatId: prevWork.formatId,
                                    structureId: prevWork.structureId
                                };
                                changeId = createSnapshot(batch, workRef, prevWork.workingChangeId, snapshot);
                                // workを更新
                                work.workingChangeId = changeId;
                                batch.update(workRef, work);
                            }
                            else {
                                // workを更新
                                batch.update(workRef, work);
                            }
                        }
                    }
                    return [4 /*yield*/, batch.commit()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function snapshotLatestWork(batch, userId, contentId) {
    return __awaiter(this, void 0, void 0, function () {
        var workRef, workSnap, work, snapshot, diffWork;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workRef = ref.users.doc(userId).works.doc(contentId);
                    return [4 /*yield*/, workRef.get()];
                case 1:
                    workSnap = _a.sent();
                    work = workSnap.data();
                    if (!work) {
                        throw null;
                    }
                    snapshot = {
                        data: work.data,
                        timestamp: work.updatedAt,
                        structureId: work.structureId
                    };
                    diffWork = {
                        state: "committed",
                        workingChangeId: null,
                        contentId: contentId
                    };
                    batch.update(workRef, diffWork);
                    return [2 /*return*/, createSnapshot(batch, workRef, work.workingChangeId, snapshot)];
            }
        });
    });
}
exports.createUser = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_1, batch, spaceData, spaceId, publicUser, privateUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                userId = genId();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, DB.auth.createUser({ uid: userId, email: data.email, password: data.password, displayName: data.displayName })];
            case 2:
                user = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, { error: error_1 }];
            case 4:
                batch = new DB.Batch();
                spaceData = {
                    displayName: data.displayName + "の個人用スペース",
                    displayId: genId(),
                    description: "ユーザー登録時に自動で作成された個人用のスペースです"
                };
                return [4 /*yield*/, _createSpace(batch, spaceData, context.auth.uid)];
            case 5:
                spaceId = _a.sent();
                publicUser = {
                    displayName: data.displayName,
                    displayId: userId,
                    iconUrl: null
                };
                privateUser = {
                    defaultSpaceId: spaceId
                };
                batch.create(ref.users.doc(user.uid), publicUser);
                batch.create(ref.userSettings.doc(user.uid), privateUser);
                return [4 /*yield*/, batch.commit()];
            case 6:
                _a.sent();
                return [2 /*return*/, user.uid];
        }
    });
}); });
function _checkSpaceDisplayId(displayId) {
    return __awaiter(this, void 0, void 0, function () {
        var snaps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.spaces.where("displayId", "==", displayId).get()];
                case 1:
                    snaps = _a.sent();
                    return [2 /*return*/, snaps.empty];
            }
        });
    });
}
exports.checkSpaceDisplayId = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _checkSpaceDisplayId(data)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
exports.createSpace = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, spaceId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                batch = new DB.Batch();
                return [4 /*yield*/, _createSpace(batch, data, context.auth.uid)];
            case 1:
                spaceId = _a.sent();
                return [4 /*yield*/, batch.commit()];
            case 2:
                _a.sent();
                return [2 /*return*/, spaceId];
        }
    });
}); });
exports.createFormat = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var formats, formatId, time, format, properties, structure, batch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ref.formats.where("spaceId", "==", data.spaceId).get()];
            case 1:
                formats = (_a.sent()).docs;
                if (formats.filter(function (snap) { return snap.data().displayId == data.displayId; }).length > 0) {
                    return [2 /*return*/, { error: "このIDのフォーマットは既にこのスペースに存在します" }];
                }
                formatId = genId();
                time = timestamp();
                format = {
                    spaceId: data.spaceId,
                    displayName: data.displayName,
                    displayId: data.displayId,
                    description: data.description,
                    defaultStructureId: "1",
                    creatorUserId: context.auth.uid,
                    createdAt: time,
                    updaterUserId: context.auth.uid,
                    updatedAt: time,
                    semanticId: null,
                    usage: data.usage,
                    generator: "none",
                    relations: purescript_index_js_1.PS.getStructureRelations(data.structure),
                    contentPage: { relations: [] },
                    collectionPage: { compositions: [] }
                };
                properties = purescript_index_js_1.PS.normalizeStructure(data.structure);
                structure = {
                    properties: properties
                };
                batch = new DB.Batch();
                batch.create(ref.formats.doc(formatId), format);
                batch.create(ref.formats.doc(formatId).structures.doc("1"), structure);
                batch.update(ref.spaces.doc(data.spaceId), { formatCount: DB.increment(1) });
                return [4 /*yield*/, batch.commit()];
            case 2:
                _a.sent();
                return [2 /*return*/, formatId];
        }
    });
}); });
function initCommitter(batch, spaceRef, committerRef) {
    return __awaiter(this, void 0, void 0, function () {
        var committerSnap, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, committerRef.get()];
                case 1:
                    committerSnap = _a.sent();
                    if (!committerSnap.exists) {
                        time = timestamp();
                        batch.create(committerRef, { firstCommittedAt: time, lastCommittedAt: time, contentCount: 0, commitCount: 0 });
                        batch.update(spaceRef, { committerCount: DB.increment(1) });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getContainerId(spaceId, formatId) {
    return __awaiter(this, void 0, void 0, function () {
        var containersSnap, containerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.containers.where("spaceId", "==", spaceId).where("formatId", "==", formatId).get()];
                case 1:
                    containersSnap = _a.sent();
                    if (!containersSnap.empty) return [3 /*break*/, 3];
                    containerId = genId();
                    return [4 /*yield*/, ref.containers.doc(containerId).create({ spaceId: spaceId, formatId: formatId, itemCount: 0 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, containerId];
                case 3: return [2 /*return*/, containersSnap.docs[0].ref.id];
            }
        });
    });
}
;
exports.createContent = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, format, structure, time, batch, commitId, content, activity, commit, containerId, spaceRef, containerRef, contentRef, junctionRef, committerRef, activityRef, commitRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                if (data.workId) {
                    contentId = data.workId;
                }
                else {
                    contentId = genId();
                }
                return [4 /*yield*/, ref.formats.doc(data.formatId).get()];
            case 1:
                format = (_a.sent()).data();
                if (!format) {
                    return [2 /*return*/, { error: "このフォーマットは存在しません" }];
                }
                return [4 /*yield*/, ref.formats.doc(data.formatId).structures.doc(format.defaultStructureId).get()];
            case 2:
                structure = (_a.sent()).data();
                if (!structure) {
                    throw new NotExists("structure");
                }
                time = timestamp();
                batch = new DB.Batch();
                // workに書き込み userId, workId, contentId, spaceId, data
                return [4 /*yield*/, writeWork({
                        spec: { workType: "content", contentId: contentId },
                        userId: context.auth.uid,
                        workId: contentId,
                        formatId: data.formatId,
                        structureId: format.defaultStructureId,
                        data: data.data
                    })];
            case 3:
                // workに書き込み userId, workId, contentId, spaceId, data
                _a.sent();
                return [4 /*yield*/, snapshotLatestWork(batch, context.auth.uid, contentId)];
            case 4:
                commitId = _a.sent();
                content = {
                    data: data.data,
                    indexes: purescript_index_js_1.PS.getContentIndexes({ props: structure.properties, data: data.data }),
                    structureId: format.defaultStructureId,
                    creatorUserId: context.auth.uid,
                    createdAt: time,
                    updaterUserId: context.auth.uid,
                    updatedAt: time,
                    viewCount: 0,
                    updateCount: 1,
                    version: 1
                };
                activity = {
                    userId: context.auth.uid,
                    timestamp: time,
                    contentId: contentId,
                    formatId: data.formatId,
                    type: "creation",
                    target: "content"
                };
                commit = {
                    data: data.data,
                    userId: context.auth.uid,
                    timestamp: time,
                    structureId: format.defaultStructureId,
                    version: 1
                };
                return [4 /*yield*/, getContainerId(data.spaceId, data.formatId)];
            case 5:
                containerId = _a.sent();
                spaceRef = ref.spaces.doc(data.spaceId);
                containerRef = ref.containers.doc(containerId);
                contentRef = containerRef.items.doc(contentId);
                junctionRef = ref.contents.doc(contentId);
                committerRef = spaceRef.committers.doc(context.auth.uid);
                activityRef = spaceRef.activities.doc(genTimeId());
                commitRef = junctionRef.commits.doc(commitId);
                return [4 /*yield*/, initCommitter(batch, spaceRef, committerRef)];
            case 6:
                _a.sent();
                batch.create(commitRef, commit);
                batch.create(contentRef, content);
                batch.create(junctionRef, { containerId: containerId, formatId: data.formatId, structureId: format.defaultStructureId });
                batch.create(activityRef, activity);
                batch.update(containerRef, { itemCount: DB.increment(1) });
                batch.update(committerRef, { lastCommittedAt: time, contentCount: DB.increment(1), commitCount: DB.increment(1) });
                return [4 /*yield*/, batch.commit()];
            case 7:
                _a.sent();
                return [2 /*return*/, contentId];
        }
    });
}); });
exports.commitContent = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var junctionRef, junction, container, format, structure, batch, time, commitId, diffContent, spaceRef, contentRef, activityRef, committerRef, prevContent, activity, commit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                junctionRef = ref.contents.doc(data.contentId);
                return [4 /*yield*/, junctionRef.get()];
            case 1:
                junction = (_a.sent()).data();
                if (!junction) {
                    return [2 /*return*/, { error: "このコンテンツは存在しません" }];
                }
                return [4 /*yield*/, ref.containers.doc(junction.containerId).get()];
            case 2:
                container = (_a.sent()).data();
                if (!container) {
                    return [2 /*return*/, { error: "このコンテナは存在しません" }];
                }
                return [4 /*yield*/, ref.formats.doc(container.formatId).get()];
            case 3:
                format = (_a.sent()).data();
                if (!format) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, ref.formats.doc(container.formatId).structures.doc(data.structureId).get()];
            case 4:
                structure = (_a.sent()).data();
                if (!structure) {
                    throw new NotExists("structure");
                }
                return [4 /*yield*/, writeWork({
                        spec: {
                            workType: "content",
                            contentId: data.contentId
                        },
                        userId: context.auth.uid,
                        workId: data.contentId,
                        formatId: container.formatId,
                        structureId: data.structureId,
                        data: data.data
                    })];
            case 5:
                _a.sent();
                batch = new DB.Batch();
                time = timestamp();
                return [4 /*yield*/, snapshotLatestWork(batch, context.auth.uid, data.contentId)];
            case 6:
                commitId = _a.sent();
                diffContent = {
                    data: data.data,
                    indexes: purescript_index_js_1.PS.getContentIndexes({ props: structure.properties, data: data.data }),
                    structureId: format.defaultStructureId,
                    updaterUserId: context.auth.uid,
                    updatedAt: time,
                    updateCount: DB.increment(1),
                    version: DB.increment(1)
                };
                spaceRef = ref.spaces.doc(container.spaceId);
                contentRef = ref.containers.doc(junction.containerId).items.doc(data.contentId);
                activityRef = spaceRef.activities.doc(genTimeId());
                committerRef = spaceRef.committers.doc(context.auth.uid);
                return [4 /*yield*/, contentRef.get()];
            case 7:
                prevContent = (_a.sent()).data();
                if (!prevContent) {
                    throw null;
                }
                activity = {
                    userId: context.auth.uid,
                    timestamp: time,
                    contentId: data.contentId,
                    formatId: container.formatId,
                    version: prevContent.version + 1,
                    type: "updation",
                    target: "content"
                };
                commit = {
                    data: data.data,
                    userId: context.auth.uid,
                    timestamp: time,
                    structureId: format.defaultStructureId,
                    version: prevContent.version + 1
                };
                return [4 /*yield*/, initCommitter(batch, spaceRef, committerRef)];
            case 8:
                _a.sent();
                if (junction.structureId != data.structureId) {
                    batch.update(junctionRef, { structureId: data.structureId });
                }
                batch.update(contentRef, diffContent);
                batch.create(activityRef, activity);
                batch.create(junctionRef.commits.doc(commitId), commit);
                batch.update(committerRef, { commitCount: DB.increment(1) });
                return [4 /*yield*/, batch.commit()];
            case 9:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
// firebase.auth().signInWithEmailAndPassword(email, password)
// firebase experimental:functions:shell
exports.writeContentWork = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var junction, container, content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ref.contents.doc(data.contentId).get()];
            case 1:
                junction = (_a.sent()).data();
                if (!junction) {
                    throw new NotExists("content");
                }
                return [4 /*yield*/, ref.containers.doc(junction.containerId).get()];
            case 2:
                container = (_a.sent()).data();
                if (!container) {
                    throw new NotExists("container");
                }
                return [4 /*yield*/, ref.containers.doc(junction.containerId).items.doc(data.contentId).get()];
            case 3:
                content = (_a.sent()).data();
                if (!content) {
                    throw new NotExists("content");
                }
                return [4 /*yield*/, writeWork({
                        spec: {
                            workType: "content",
                            contentId: data.contentId
                        },
                        userId: context.auth.uid,
                        workId: data.contentId,
                        formatId: container.formatId,
                        structureId: data.structureId,
                        data: data.data
                    })];
            case 4: return [2 /*return*/, _a.sent()];
        }
    });
}); });
exports.updateBlankWork = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, writeWork({
                        spec: {
                            workType: "blank",
                            spaceId: data.spaceId
                        },
                        userId: context.auth.uid,
                        workId: data.workId,
                        formatId: data.formatId,
                        structureId: data.structureId,
                        data: data.data
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
exports.createBlankWork = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var workId, workRef, format, work;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                workId = genId();
                workRef = ref.users.doc(context.auth.uid).works.doc(workId);
                return [4 /*yield*/, ref.formats.doc(data.formatId).get()];
            case 1:
                format = (_a.sent()).data();
                if (!format) {
                    return [2 /*return*/, { error: "このフォーマットは定義されていません" }];
                }
                work = mkNewWork({ workType: "blank", spaceId: data.spaceId }, data.formatId, format.defaultStructureId, data.data);
                return [4 /*yield*/, workRef.create(work)];
            case 2:
                _a.sent();
                return [2 /*return*/, workId];
        }
    });
}); });
exports.deleteWork = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var workRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                workRef = ref.users.doc(context.auth.uid).works.doc(data);
                return [4 /*yield*/, workRef.update({ state: "deleted" })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setMyDisplayName = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                userRef = ref.users.doc(context.auth.uid);
                return [4 /*yield*/, userRef.update({ displayName: data })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setMyIcon = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                userRef = ref.users.doc(context.auth.uid);
                return [4 /*yield*/, userRef.update({ iconUrl: timestamp().toString() })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setSpaceDisplayName = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                if (typeof data.displayName != "string") {
                    return [2 /*return*/, { error: "入力エラー" }];
                }
                return [4 /*yield*/, spaceRef.update({ displayName: data.displayName })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setSpaceHomeImage = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                return [4 /*yield*/, spaceRef.update({ homeUrl: timestamp().toString() })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setSpacePublished = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef, space;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                if (typeof data.published != "boolean") {
                    return [2 /*return*/, { error: "入力エラー" }];
                }
                if (!data.published) return [3 /*break*/, 2];
                return [4 /*yield*/, spaceRef.get()];
            case 1:
                space = (_a.sent()).data();
                if (!space) {
                    return [2 /*return*/, { error: "このスペースは存在しません" }];
                }
                if (space.authority.base == "none") {
                    return [2 /*return*/, { error: "標準権限がVisible以上に設定されていないとPublishedを有効にすることはできません" }];
                }
                _a.label = 2;
            case 2: return [4 /*yield*/, spaceRef.update({ published: data.published })];
            case 3:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setSpaceAuthority = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                return [4 /*yield*/, spaceRef.update({ authority: data.authority })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setSpaceDisplayId = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _checkSpaceDisplayId(data.displayId)];
            case 1:
                if (!(_a.sent())) {
                    return [2 /*return*/, { error: "このIDは既に存在します" }];
                }
                spaceRef = ref.spaces.doc(data.spaceId);
                return [4 /*yield*/, spaceRef.update({ displayId: data.displayId })];
            case 2:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setFormatContentPage = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var formatRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                formatRef = ref.formats.doc(data.formatId);
                return [4 /*yield*/, formatRef.update({ contentPage: data.contentPage })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setFormatCollectionPage = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var formatRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                formatRef = ref.formats.doc(data.formatId);
                return [4 /*yield*/, formatRef.update({ collectionPage: data.collectionPage })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.applySpaceMembership = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var memberRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                memberRef = ref.spaces.doc(data.spaceId).members.doc(context.auth.uid);
                return [4 /*yield*/, memberRef.create({ type: "pending", appliedAt: timestamp(), joinedAt: null })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.acceptSpaceMembership = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef, memberRef, memberSnap, member, batch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                memberRef = spaceRef.members.doc(data.userId);
                return [4 /*yield*/, memberRef.get()];
            case 1:
                memberSnap = _a.sent();
                if (!memberSnap.exists) {
                    return [2 /*return*/, { error: "このユーザーは申請していません" }];
                }
                member = memberSnap.data();
                if (!member) {
                    return [2 /*return*/, { error: "このメンバーは存在しません" }];
                }
                if (member.type != "pending") {
                    return [2 /*return*/, { error: "既にメンバーです" }];
                }
                batch = new DB.Batch();
                batch.update(memberRef, { type: "normal", appliedAt: null, joinedAt: timestamp() });
                batch.update(spaceRef, { memberCount: DB.increment(1) });
                return [4 /*yield*/, batch.commit()];
            case 2:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.rejectSpaceMembership = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef, memberRef, memberSnap, member, batch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                memberRef = spaceRef.members.doc(data.userId);
                return [4 /*yield*/, memberRef.get()];
            case 1:
                memberSnap = _a.sent();
                if (!memberSnap.exists) {
                    return [2 /*return*/, { error: "このユーザーは申請していません" }];
                }
                member = memberSnap.data();
                if (!member) {
                    return [2 /*return*/, { error: "このメンバーは存在しません" }];
                }
                if (member.type != "pending") {
                    return [2 /*return*/, { error: "既にメンバーです" }];
                }
                batch = new DB.Batch();
                batch.delete(memberRef);
                return [4 /*yield*/, batch.commit()];
            case 2:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.cancelSpaceMembershipApplication = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var memberRef, memberSnap, member;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                memberRef = ref.spaces.doc(data.spaceId).members.doc(context.auth.uid);
                return [4 /*yield*/, memberRef.get()];
            case 1:
                memberSnap = _a.sent();
                if (!memberSnap.exists) {
                    return [2 /*return*/, { error: "申請していません" }];
                }
                member = memberSnap.data();
                if (!member) {
                    return [2 /*return*/, { error: "このメンバーは存在しません" }];
                }
                if (member.type != "pending") {
                    return [2 /*return*/, { error: "既にメンバーです" }];
                }
                return [4 /*yield*/, memberRef.delete()];
            case 2:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setSpaceMembershipMethod = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var spaceRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spaceRef = ref.spaces.doc(data.spaceId);
                return [4 /*yield*/, spaceRef.update({ membershipMethod: data.membershipMethod })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
/*
    generatorプロパティはnone, reactor, transformer, crawlerのどれかが指定できる
    Content generator(Reactor, Transformer, Crawler)(以後CG)は、種類にごとにFormatに1つまで作成できる
    一度作成された物が削除されることはない
*/
exports.setContentGenerator = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var formatRef, format, spaceRef, space, time, batch, reactorRef, reactorSnap, reactor, reactorRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                formatRef = ref.formats.doc(data.formatId);
                return [4 /*yield*/, formatRef.get()];
            case 1:
                format = (_a.sent()).data();
                if (!format) {
                    return [2 /*return*/, { error: "このフォーマットは存在しません" }];
                }
                if (format.usage != "internal") {
                    return [2 /*return*/, { error: "Content generatorはInternal formatにしか作成できません" }];
                }
                spaceRef = ref.spaces.doc(format.spaceId);
                return [4 /*yield*/, spaceRef.get()];
            case 2:
                space = (_a.sent()).data();
                time = timestamp();
                batch = new DB.Batch();
                if (!(data.generator == "reactor")) return [3 /*break*/, 4];
                reactorRef = ref.reactors.doc(data.formatId);
                return [4 /*yield*/, reactorRef.get()];
            case 3:
                reactorSnap = _a.sent();
                if (!reactorSnap.exists) {
                    reactor = {
                        spaceId: format.spaceId,
                        definitionId: null,
                        creatorUserId: context.auth.uid,
                        createdAt: time,
                        state: "invaild"
                    };
                    batch.create(reactorRef, reactor);
                }
                return [3 /*break*/, 5];
            case 4:
                if (data.generator == "none") {
                    if (format.generator == "reactor") {
                        reactorRef = ref.reactors.doc(data.formatId);
                        batch.update(reactorRef, { state: "disused" });
                    }
                }
                else {
                    return [2 /*return*/, { error: "'" + data.generator + "'はContent generatorに指定できません" }];
                }
                _a.label = 5;
            case 5:
                batch.update(formatRef, { generator: data.generator });
                return [4 /*yield*/, batch.commit()];
            case 6:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.setReactorDefinitionId = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var reactorRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reactorRef = ref.reactors.doc(data.formatId);
                return [4 /*yield*/, reactorRef.update({ definitionId: data.definitionId })];
            case 1:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
function getContentObject(content, structure) {
    function mkValue(value, type) {
        if (value === undefined || value === null) {
            return null;
        }
        else if (type.name == "object") {
            return mkObject(value, type.arguments.properties);
        }
        else if (type.name == "array") {
            return value.map(function (item) { return mkValue(item, type.arguments.type); });
        }
        else {
            return value;
        }
    }
    function mkObject(data, properties) {
        return toMap(properties, function (x) { return x.fieldName || x.id; }, function (x) { return mkValue(data[x.id], x.type); });
    }
    return mkObject(content, structure.properties);
}
function getContentData(obj, structure) {
    function mkValue(value, type) {
        if (value === undefined || value === null) {
            return null;
        }
        else if (type.name == "object") {
            return mkObject(value, type.arguments.properties);
        }
        else if (type.name == "array") {
            return value.map(function (item) { return mkValue(item, type.arguments.type); });
        }
        else {
            return value;
        }
    }
    function mkObject(data, properties) {
        return toMap(properties, function (x) { return x.id; }, function (x) { return mkValue(data[x.fieldName || x.id], x.type); });
    }
    return mkObject(obj, structure.properties);
}
function getContentByReactor(formatId, defaultStructureId) {
    return __awaiter(this, void 0, void 0, function () {
        // Functionコンストラクタによって作成される関数は、トップレベルスコープのクロージャである。
        // ブラウザ上では、トップレベルスコープはグローバルスコープだが、
        // Cloud Functionsが実行されるNodeJs上では、トップレベルスコープはグローバルスコープではない。
        // そのため、セキュリティ上の問題はない。
        function request(url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.request({ url: url })];
                        case 1:
                            response = _a.sent();
                            console.log(response.data);
                            return [2 /*return*/, response.data];
                    }
                });
            });
        }
        var structureSnap, structure, reactorSnap, reactor, definition, reactorStructureSnap, reactorStructure, definitionObj, code, imports;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.formats.doc(formatId).structures.doc(defaultStructureId).get()];
                case 1:
                    structureSnap = _a.sent();
                    structure = structureSnap.data();
                    if (!structure) {
                        throw null;
                    }
                    return [4 /*yield*/, ref.reactors.doc(formatId).get()];
                case 2:
                    reactorSnap = _a.sent();
                    reactor = reactorSnap.data();
                    if (!reactor) {
                        throw null;
                    }
                    if (!reactor.definitionId) {
                        throw { error: "定義コンテンツが指定されていません" };
                    }
                    return [4 /*yield*/, getContent(reactor.definitionId)];
                case 3:
                    definition = _a.sent();
                    return [4 /*yield*/, ref.formats.doc(definition.formatId).structures.doc(definition.structureId).get()];
                case 4:
                    reactorStructureSnap = _a.sent();
                    reactorStructure = reactorStructureSnap.data();
                    if (!reactorStructure) {
                        throw null;
                    }
                    definitionObj = getContentObject(definition.data, reactorStructure);
                    code = "const exports = {};";
                    code += definitionObj.code;
                    code += "return exports;";
                    imports = Function("request", code)(request);
                    return [2 /*return*/, {
                            structure: structure, imports: imports
                        }];
            }
        });
    });
}
function upsertContent(contentData, creator, format, structure, formatId, containerId) {
    return __awaiter(this, void 0, void 0, function () {
        var containerRef, contentsRef, semanticId, cacheSnaps, time, indexes, contentId, content, batch, cacheSnap, cache, diffContent, batch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    containerRef = ref.containers.doc(containerId);
                    contentsRef = containerRef.items;
                    if (!format.semanticId) {
                        throw null;
                    }
                    semanticId = contentData[format.semanticId];
                    return [4 /*yield*/, contentsRef.where("data." + format.semanticId, "==", semanticId).get()];
                case 1:
                    cacheSnaps = _a.sent();
                    time = timestamp();
                    indexes = purescript_index_js_1.PS.getContentIndexes({ props: structure.properties, data: contentData });
                    if (!cacheSnaps.empty) return [3 /*break*/, 3];
                    contentId = genId();
                    content = {
                        indexes: indexes,
                        formatId: formatId,
                        structureId: format.defaultStructureId,
                        createdAt: time,
                        creatorUserId: creator,
                        version: 1,
                        viewCount: 0,
                        updateCount: 1,
                        updatedAt: time,
                        updaterUserId: creator,
                        data: contentData
                    };
                    batch = new DB.Batch();
                    batch.create(ref.contents.doc(contentId), { containerId: containerId, formatId: formatId, structureId: format.defaultStructureId });
                    batch.create(contentsRef.doc(contentId), content);
                    batch.update(ref.containers.doc(containerId), { itemCount: DB.increment(1) });
                    return [4 /*yield*/, batch.commit()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, content), { contentId: contentId })];
                case 3:
                    cacheSnap = cacheSnaps.docs[0];
                    cache = cacheSnap.data();
                    diffContent = {
                        indexes: indexes,
                        structureId: format.defaultStructureId,
                        updateCount: DB.increment(1),
                        data: contentData,
                        updatedAt: time,
                        updaterUserId: creator
                    };
                    batch = new DB.Batch();
                    if (cache.structureId != format.defaultStructureId) {
                        batch.update(ref.contents.doc(cacheSnap.id), { structureId: format.defaultStructureId });
                    }
                    batch.update(new DB.DocumentReference(cacheSnap.ref), diffContent);
                    return [4 /*yield*/, batch.commit()];
                case 4:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign(__assign({}, cache), diffContent), { contentId: cacheSnap.id, updateCount: cache.updateCount + 1 })];
            }
        });
    });
}
exports.getContentBySemanticId = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var formatSnap, format, _a, structure, imports, contentObj, contentData, containerId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ref.formats.doc(data.formatId).get()];
            case 1:
                formatSnap = _b.sent();
                format = formatSnap.data();
                if (!format) {
                    return [2 /*return*/, { error: "このフォーマットは存在しません" }];
                }
                if (!(format.generator == "reactor")) return [3 /*break*/, 6];
                return [4 /*yield*/, getContentByReactor(data.formatId, format.defaultStructureId)];
            case 2:
                _a = _b.sent(), structure = _a.structure, imports = _a.imports;
                return [4 /*yield*/, imports.get(data.semanticId)];
            case 3:
                contentObj = _b.sent();
                contentData = getContentData(contentObj, structure);
                return [4 /*yield*/, getContainerId(format.spaceId, data.formatId)];
            case 4:
                containerId = _b.sent();
                return [4 /*yield*/, upsertContent(contentData, "reactor", format, structure, data.formatId, containerId)];
            case 5: return [2 /*return*/, _b.sent()];
            case 6: return [2 /*return*/, null];
        }
    });
}); });
exports.getContentsByReactor = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    function toContent(contentData) {
        if (!format) {
            throw null;
        }
        return {
            indexes: {},
            structureId: format.defaultStructureId,
            createdAt: time,
            creatorUserId: "reactor",
            version: 1,
            viewCount: 0,
            updateCount: 1,
            updatedAt: time,
            updaterUserId: "reactor",
            data: contentData
        };
    }
    var formatSnap, format, _a, structure, imports, contentObjs, contentDatas, time, contents;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ref.formats.doc(data.formatId).get()];
            case 1:
                formatSnap = _b.sent();
                format = formatSnap.data();
                if (!format) {
                    return [2 /*return*/, { error: "このフォーマットは存在しません" }];
                }
                if (format.generator != "reactor") {
                    return [2 /*return*/, { error: "Reactorが設定されていません" }];
                }
                return [4 /*yield*/, getContentByReactor(data.formatId, format.defaultStructureId)];
            case 2:
                _a = _b.sent(), structure = _a.structure, imports = _a.imports;
                return [4 /*yield*/, imports.list(data.words, data.conditions)];
            case 3:
                contentObjs = _b.sent();
                contentDatas = contentObjs.map(function (contentObj) { return getContentData(contentObj, structure); });
                time = timestamp();
                contents = contentDatas.map(toContent);
                console.log(contents);
                return [2 /*return*/, contents];
        }
    });
}); });
exports.updateFormatStructure = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var formatRef, formatSnap, format, structureRef, structureSnap, structure, properties, changeType, newVersion, structure_1, newFormat, batch, newStructure, newFormat, batch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                formatRef = ref.formats.doc(data.formatId);
                return [4 /*yield*/, formatRef.get()];
            case 1:
                formatSnap = _a.sent();
                format = formatSnap.data();
                if (!format) {
                    return [2 /*return*/, { error: "このフォーマットは存在しません" }];
                }
                structureRef = formatRef.structures.doc(format.defaultStructureId);
                return [4 /*yield*/, structureRef.get()];
            case 2:
                structureSnap = _a.sent();
                structure = structureSnap.data();
                if (!structure) {
                    return [2 /*return*/, { error: "このストラクチャは存在しません" }];
                }
                properties = purescript_index_js_1.PS.normalizeStructure(data.properties);
                changeType = purescript_index_js_1.PS.getStructureChangeType({ before: structure.properties, after: data.properties });
                console.log(changeType);
                if (!(changeType == "none")) return [3 /*break*/, 3];
                return [2 /*return*/, { error: "変化ありません" }];
            case 3:
                if (!(changeType == "major")) return [3 /*break*/, 5];
                newVersion = (parseInt(format.defaultStructureId) + 1).toString();
                structure_1 = {
                    properties: properties
                };
                newFormat = {
                    updatedAt: timestamp(),
                    updaterUserId: context.auth.uid,
                    defaultStructureId: newVersion,
                    relations: purescript_index_js_1.PS.getStructureRelations(data.properties)
                };
                batch = new DB.Batch();
                batch.create(formatRef.structures.doc(newVersion), structure_1);
                batch.update(formatRef, newFormat);
                return [4 /*yield*/, batch.commit()];
            case 4:
                _a.sent();
                return [2 /*return*/, {}];
            case 5:
                if (!(changeType == "minor")) return [3 /*break*/, 7];
                newStructure = {
                    properties: properties,
                };
                newFormat = {
                    updatedAt: timestamp(),
                    updaterUserId: context.auth.uid,
                    relations: purescript_index_js_1.PS.getStructureRelations(data.properties)
                };
                batch = new DB.Batch();
                batch.update(structureRef, newStructure);
                batch.update(formatRef, newFormat);
                return [4 /*yield*/, batch.commit()];
            case 6:
                _a.sent();
                return [2 /*return*/, {}];
            case 7: return [2 /*return*/, { error: "エラー" }];
        }
    });
}); });
exports.createCrawler = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var crawlerId, crawler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                crawlerId = genId();
                crawler = {
                    spaceId: data.spaceId,
                    definitionId: data.definitionId,
                    displayName: data.displayName,
                    updatedAt: timestamp(),
                    updaterUserId: "reactor"
                };
                return [4 /*yield*/, ref.crawlers.doc(crawlerId).create(crawler)];
            case 1:
                _a.sent();
                return [2 /*return*/, crawlerId];
        }
    });
}); });
function getContent(contentId) {
    return __awaiter(this, void 0, void 0, function () {
        var junctionSnap, junction, container, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.contents.doc(contentId).get()];
                case 1:
                    junctionSnap = _a.sent();
                    junction = junctionSnap.data();
                    if (!junction) {
                        throw new NotExists("content");
                    }
                    return [4 /*yield*/, ref.containers.doc(junction.containerId).get()];
                case 2:
                    container = (_a.sent()).data();
                    if (!container) {
                        throw new NotExists("container");
                    }
                    return [4 /*yield*/, ref.containers.doc(junction.containerId).items.doc(contentId).get()];
                case 3: return [4 /*yield*/, (_a.sent()).data()];
                case 4:
                    content = _a.sent();
                    if (!content) {
                        throw new NotExists("content");
                    }
                    return [2 /*return*/, __assign(__assign({}, content), container)];
            }
        });
    });
}
function getCrawler(crawlerId) {
    return __awaiter(this, void 0, void 0, function () {
        var crawlerSnap, crawler, definition, crawlerStructureSnap, crawlerStructure, definitionObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.crawlers.doc(crawlerId).get()];
                case 1:
                    crawlerSnap = _a.sent();
                    crawler = crawlerSnap.data();
                    if (!crawler) {
                        throw "not found crawler";
                    }
                    return [4 /*yield*/, getContent(crawler.definitionId)];
                case 2:
                    definition = _a.sent();
                    return [4 /*yield*/, ref.formats.doc(definition.formatId).structures.doc(definition.structureId).get()];
                case 3:
                    crawlerStructureSnap = _a.sent();
                    crawlerStructure = crawlerStructureSnap.data();
                    if (!crawlerStructure) {
                        throw new NotExists("structure");
                    }
                    definitionObj = getContentObject(definition.data, crawlerStructure);
                    return [2 /*return*/, {
                            crawler: crawler,
                            crawlerDefinition: definitionObj
                        }];
            }
        });
    });
}
function getScraper(contentId) {
    return __awaiter(this, void 0, void 0, function () {
        var scraper, scraperStructureSnap, scraperStructure;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getContent(contentId)];
                case 1:
                    scraper = _a.sent();
                    if (!scraper) {
                        throw "not found scraper";
                    }
                    return [4 /*yield*/, ref.formats.doc(scraper.formatId).structures.doc(scraper.structureId).get()];
                case 2:
                    scraperStructureSnap = _a.sent();
                    scraperStructure = scraperStructureSnap.data();
                    if (!scraperStructure) {
                        throw "not found scraper's structure";
                    }
                    return [2 /*return*/, getContentObject(scraper.data, scraperStructure)];
            }
        });
    });
}
function getTaskMethodAndCacheId(operationMethod, crawlerId, url) {
    return __awaiter(this, void 0, void 0, function () {
        var cachesSnap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(operationMethod == "crawling")) return [3 /*break*/, 1];
                    return [2 /*return*/, { method: "crawling", cacheId: genId() }];
                case 1: return [4 /*yield*/, ref.crawlers.doc(crawlerId).caches.where("url", "==", url).get()];
                case 2:
                    cachesSnap = _a.sent();
                    if (cachesSnap.empty) {
                        return [2 /*return*/, { method: "crawling", cacheId: genId() }];
                    }
                    else {
                        return [2 /*return*/, { method: "scraping", cacheId: cachesSnap.docs[0].id }];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.runCrawler = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var time, operationId, operation, crawlerRef, runningOperationsSnap, operationRef, ent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLogined(context.auth)) {
                    return [2 /*return*/];
                }
                time = timestamp();
                operationId = genId();
                operation = {
                    status: "running",
                    createdAt: time,
                    method: data.method,
                    executorUserId: context.auth.uid,
                    contentCount: 0,
                    fetchingCount: 0,
                    scrapingCount: 0,
                    startedAt: null,
                    endedAt: null
                };
                crawlerRef = ref.crawlers.doc(data.crawlerId);
                return [4 /*yield*/, crawlerRef.operations.where("status", "==", "running").get()];
            case 1:
                runningOperationsSnap = _a.sent();
                operationRef = crawlerRef.operations.doc(operationId);
                return [4 /*yield*/, operationRef.create(operation)];
            case 2:
                _a.sent();
                return [4 /*yield*/, getCrawler(data.crawlerId)];
            case 3:
                ent = _a.sent();
                return [4 /*yield*/, Promise.all(ent.crawlerDefinition.startups.map(function (startup) { return __awaiter(void 0, void 0, void 0, function () {
                        var taskId, _a, method, cacheId, task, taskMsg, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    taskId = genId();
                                    return [4 /*yield*/, getTaskMethodAndCacheId(data.method, data.crawlerId, startup.url)];
                                case 1:
                                    _a = _d.sent(), method = _a.method, cacheId = _a.cacheId;
                                    task = {
                                        url: startup.url,
                                        scraperId: startup.scraper,
                                        createdAt: time,
                                        status: "pending",
                                        method: method,
                                        cacheId: cacheId,
                                        output: null,
                                        message: null,
                                        startedAt: null,
                                        endedAt: null
                                    };
                                    _b = [__assign({}, task)];
                                    _c = { taskId: taskId, operationId: operationId, crawlerId: data.crawlerId, spaceId: ent.crawler.spaceId };
                                    return [4 /*yield*/, getScraper(task.scraperId)];
                                case 2:
                                    taskMsg = __assign.apply(void 0, _b.concat([(_c.scrapingCode = (_d.sent()).code, _c)]));
                                    return [4 /*yield*/, operationRef.tasks.doc(taskId).create(task)];
                                case 3:
                                    _d.sent();
                                    return [4 /*yield*/, crawlingTopic.publishJSON(taskMsg)];
                                case 4:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
var crawlerAuth = "c95b763282404389a6024a9d6a55f53f576c442746c44fccbf7490679b29d129";
exports.beginCrawlingTask = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var crawlerRer, operationRef, taskRef, task, time, operation, newOperation, newTask;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (data.auth != crawlerAuth) {
                    return [2 /*return*/, { error: "認証エラー" }];
                }
                crawlerRer = ref.crawlers.doc(data.crawlerId);
                operationRef = crawlerRer.operations.doc(data.operationId);
                taskRef = operationRef.tasks.doc(data.taskId);
                return [4 /*yield*/, taskRef.get()];
            case 1:
                task = (_a.sent()).data();
                time = timestamp();
                return [4 /*yield*/, operationRef.get()];
            case 2:
                operation = (_a.sent()).data();
                if (!operation) {
                    return [2 /*return*/, { error: "このオペレーションは存在しません" }];
                }
                if (!(operation.status == "provisioning")) return [3 /*break*/, 4];
                newOperation = {
                    startedAt: time,
                    status: "running"
                };
                return [4 /*yield*/, operationRef.update(newOperation)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!task) {
                    return [2 /*return*/, { error: "このタスクは存在しません" }];
                }
                if (!(task.method == "crawling")) return [3 /*break*/, 6];
                return [4 /*yield*/, operationRef.update({ fetchingCount: DB.increment(1), scrapingCount: DB.increment(1) })];
            case 5:
                _a.sent();
                return [3 /*break*/, 8];
            case 6:
                if (!(task.method == "scraping")) return [3 /*break*/, 8];
                return [4 /*yield*/, operationRef.update({ scrapingCount: DB.increment(1) })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!(task.status == "pending")) return [3 /*break*/, 10];
                newTask = {
                    startedAt: time,
                    status: "running"
                };
                return [4 /*yield*/, taskRef.update(newTask)];
            case 9:
                _a.sent();
                return [2 /*return*/, true];
            case 10: return [2 /*return*/, false];
        }
    });
}); });
// data = { crawlerId: string, operationId: string, taskId: string, contents: [{ kind: string, data: obj }], indexes: [{ kind: string, url: string }] }
exports.completeCrawlingTask = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var crawlerRef, crawler, operationRef, operation, taskRef, task, resultIndexes, resultContents, scraper, indexMap_1, contentMapPromises, contentMap_1, _a, e_1, newTask;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (data.auth != crawlerAuth) {
                    return [2 /*return*/, { error: "認証エラー" }];
                }
                crawlerRef = ref.crawlers.doc(data.crawlerId);
                return [4 /*yield*/, crawlerRef.get()];
            case 1:
                crawler = (_b.sent()).data();
                if (!crawler) {
                    return [2 /*return*/, { error: "このクローラーは存在しません" }];
                }
                operationRef = crawlerRef.operations.doc(data.operationId);
                return [4 /*yield*/, operationRef.get()];
            case 2:
                operation = (_b.sent()).data();
                if (!operation) {
                    return [2 /*return*/, { error: "このオペレーションは存在しません" }];
                }
                taskRef = operationRef.tasks.doc(data.taskId);
                return [4 /*yield*/, taskRef.get()];
            case 3:
                task = (_b.sent()).data();
                if (!task) {
                    return [2 /*return*/, { error: "このタスクは存在しません" }];
                }
                _b.label = 4;
            case 4:
                _b.trys.push([4, 9, , 14]);
                return [4 /*yield*/, getScraper(task.scraperId)];
            case 5:
                scraper = _b.sent();
                indexMap_1 = toMap(scraper.outputIndexes, function (x) { return x.kind; }, function (x) { return x.scraper; });
                contentMapPromises = scraper.outputContents.map(function (x) { return __awaiter(void 0, void 0, void 0, function () {
                    var formatRef, format, structureRef, structure, containerId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                formatRef = ref.formats.doc(x.format);
                                return [4 /*yield*/, formatRef.get()];
                            case 1:
                                format = (_a.sent()).data();
                                if (!format) {
                                    throw { error: "このフォーマットは存在しません" };
                                }
                                structureRef = formatRef.structures.doc(format.defaultStructureId);
                                return [4 /*yield*/, structureRef.get()];
                            case 2:
                                structure = (_a.sent()).data();
                                if (!structure) {
                                    throw new NotExists("structure");
                                }
                                return [4 /*yield*/, getContainerId(format.spaceId, x.format)];
                            case 3:
                                containerId = _a.sent();
                                return [2 /*return*/, {
                                        kind: x.kind,
                                        format: format,
                                        structure: structure,
                                        formatId: x.format,
                                        containerId: containerId
                                    }];
                        }
                    });
                }); });
                _a = toMap;
                return [4 /*yield*/, Promise.all(contentMapPromises)];
            case 6:
                contentMap_1 = _a.apply(void 0, [_b.sent(), function (x) { return x.kind; }, function (x) { return x; }]);
                return [4 /*yield*/, Promise.all(data.indexes.map(function (index) { return __awaiter(void 0, void 0, void 0, function () {
                        var oldTasks, _a, method, cacheId, taskId, task_1, taskMsg, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, operationRef.tasks.where("url", "==", index.url).get()];
                                case 1:
                                    oldTasks = _d.sent();
                                    if (!oldTasks.empty) return [3 /*break*/, 6];
                                    return [4 /*yield*/, getTaskMethodAndCacheId(operation.method, data.crawlerId, index.url)];
                                case 2:
                                    _a = _d.sent(), method = _a.method, cacheId = _a.cacheId;
                                    taskId = genId();
                                    task_1 = {
                                        url: index.url,
                                        scraperId: indexMap_1[index.kind],
                                        createdAt: timestamp(),
                                        status: "pending",
                                        method: method,
                                        cacheId: cacheId,
                                        output: null,
                                        message: null,
                                        startedAt: null,
                                        endedAt: null
                                    };
                                    _b = [__assign({}, task_1)];
                                    _c = { taskId: taskId, operationId: data.operationId, crawlerId: data.crawlerId, spaceId: crawler.spaceId };
                                    return [4 /*yield*/, getScraper(task_1.scraperId)];
                                case 3:
                                    taskMsg = __assign.apply(void 0, _b.concat([(_c.scrapingCode = (_d.sent()).code, _c)]));
                                    return [4 /*yield*/, operationRef.tasks.doc(taskId).create(task_1)];
                                case 4:
                                    _d.sent();
                                    return [4 /*yield*/, crawlingTopic.publishJSON(taskMsg)];
                                case 5:
                                    _d.sent();
                                    return [2 /*return*/, {
                                            url: index.url,
                                            taskId: taskId,
                                            class: "new"
                                        }];
                                case 6: return [2 /*return*/, {
                                        url: index.url,
                                        taskId: null,
                                        class: "duplication"
                                    }];
                            }
                        });
                    }); }))];
            case 7:
                resultIndexes = _b.sent();
                return [4 /*yield*/, Promise.all(data.contents.map(function (content) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, formatId, format, structure, containerId, errors, contentData, newContent;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = contentMap_1[content.kind], formatId = _a.formatId, format = _a.format, structure = _a.structure, containerId = _a.containerId;
                                    errors = purescript_index_js_1.PS.validateContentObject({ props: structure.properties, data: content.data });
                                    if (errors.length > 0) {
                                        throw new BatchUsersError("出力コンテンツ(kind:" + content.kind + ")のフォーマットが適切ではありません\n" + errors.join("\n"));
                                    }
                                    contentData = getContentData(content.data, structure);
                                    return [4 /*yield*/, upsertContent(contentData, "crawler", format, structure, formatId, containerId)];
                                case 1:
                                    newContent = _b.sent();
                                    return [2 /*return*/, { contentId: newContent.contentId, version: newContent.version }];
                            }
                        });
                    }); }))];
            case 8:
                resultContents = _b.sent();
                return [3 /*break*/, 14];
            case 9:
                e_1 = _b.sent();
                if (!(e_1 instanceof BatchUsersError)) return [3 /*break*/, 11];
                return [4 /*yield*/, _failedCrawlingTask(operationRef, taskRef, "importing", e_1.error)];
            case 10:
                _b.sent();
                console.log(e_1.error);
                return [2 /*return*/, { error: e_1.error }];
            case 11: return [4 /*yield*/, _failedCrawlingTask(operationRef, taskRef, "importing", "内部エラー")];
            case 12:
                _b.sent();
                throw e_1;
            case 13: return [3 /*break*/, 14];
            case 14: 
            // update opration
            return [4 /*yield*/, operationRef.update({ contentCount: DB.increment(resultContents.length) })];
            case 15:
                // update opration
                _b.sent();
                newTask = {
                    status: "completed",
                    output: { indexes: resultIndexes, contents: resultContents },
                    endedAt: timestamp()
                };
                return [4 /*yield*/, taskRef.update(newTask)];
            case 16:
                _b.sent();
                return [4 /*yield*/, checkOperationCompletion(operationRef)];
            case 17:
                _b.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
function checkOperationCompletion(operationRef) {
    return __awaiter(this, void 0, void 0, function () {
        var pendingTasks, runningTasks, newOperation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, operationRef.tasks.where("status", "==", "pending").get()];
                case 1:
                    pendingTasks = _a.sent();
                    return [4 /*yield*/, operationRef.tasks.where("status", "==", "running").get()];
                case 2:
                    runningTasks = _a.sent();
                    if (!(pendingTasks.empty && runningTasks.empty)) return [3 /*break*/, 4];
                    newOperation = {
                        status: "completed",
                        endedAt: timestamp()
                    };
                    return [4 /*yield*/, operationRef.update(newOperation)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function _failedCrawlingTask(operationRef, taskRef, phase, message) {
    return __awaiter(this, void 0, void 0, function () {
        var newTask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newTask = {
                        status: "failed_" + phase,
                        message: message,
                        endedAt: timestamp()
                    };
                    return [4 /*yield*/, taskRef.update(newTask)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, checkOperationCompletion(operationRef)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.failedCrawlingTask = onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var crawlerRef, operationRef, taskRef, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (data.auth != crawlerAuth) {
                    return [2 /*return*/, { error: "認証エラー" }];
                }
                crawlerRef = ref.crawlers.doc(data.crawlerId);
                operationRef = crawlerRef.operations.doc(data.operationId);
                taskRef = operationRef.tasks.doc(data.taskId);
                return [4 /*yield*/, taskRef.get()];
            case 1:
                task = (_a.sent()).data();
                if (!task) {
                    return [2 /*return*/, { error: "このタスクは存在しません" }];
                }
                if (!(task.status == "running")) return [3 /*break*/, 3];
                return [4 /*yield*/, _failedCrawlingTask(operationRef, taskRef, data.phase, data.message)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, {}];
        }
    });
}); });
//# sourceMappingURL=index2.js.map