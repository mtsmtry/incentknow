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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.increment = exports.Batch = exports.Reference = exports.OperationReference = exports.CrawlerReference = exports.JunctionReference = exports.ChangeReference = exports.WorkReference = exports.UserReference = exports.DocumentReference = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./../service-account-file.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://incentknow.firebaseio.com"
});
var db = admin.firestore();
var CollectionReference = /** @class */ (function () {
    function CollectionReference(ref, newDocRef) {
        this.ref = ref;
        this.newDocRef = newDocRef;
    }
    CollectionReference.prototype.where = function (fieldPath, opStr, value) {
        return this.ref.where(fieldPath, opStr, value);
    };
    CollectionReference.prototype.doc = function (documentPath) {
        return new this.newDocRef(this.ref.doc(documentPath));
    };
    CollectionReference.prototype.get = function () {
        return this.ref.get();
    };
    return CollectionReference;
}());
var DocumentReference = /** @class */ (function () {
    function DocumentReference(ref) {
        this.ref = ref;
    }
    DocumentReference.prototype.get = function () {
        return this.ref.get();
    };
    DocumentReference.prototype.create = function (data) {
        return this.ref.create(data);
    };
    DocumentReference.prototype.update = function (data) {
        return this.ref.update(data);
    };
    DocumentReference.prototype.delete = function () {
        return this.ref.delete();
    };
    return DocumentReference;
}());
exports.DocumentReference = DocumentReference;
var UserReference = /** @class */ (function (_super) {
    __extends(UserReference, _super);
    function UserReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(UserReference.prototype, "works", {
        get: function () {
            return new CollectionReference(this.ref.collection("works"), WorkReference);
        },
        enumerable: false,
        configurable: true
    });
    return UserReference;
}(DocumentReference));
exports.UserReference = UserReference;
var WorkReference = /** @class */ (function (_super) {
    __extends(WorkReference, _super);
    function WorkReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(WorkReference.prototype, "changes", {
        get: function () {
            return new CollectionReference(this.ref.collection("changes"), ChangeReference);
        },
        enumerable: false,
        configurable: true
    });
    return WorkReference;
}(DocumentReference));
exports.WorkReference = WorkReference;
var ChangeReference = /** @class */ (function (_super) {
    __extends(ChangeReference, _super);
    function ChangeReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ChangeReference.prototype, "snapshots", {
        get: function () {
            return new CollectionReference(this.ref.collection("snapshots"), DocumentReference);
        },
        enumerable: false,
        configurable: true
    });
    return ChangeReference;
}(DocumentReference));
exports.ChangeReference = ChangeReference;
var JunctionReference = /** @class */ (function (_super) {
    __extends(JunctionReference, _super);
    function JunctionReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(JunctionReference.prototype, "commits", {
        get: function () {
            return new CollectionReference(this.ref.collection("commits"), DocumentReference);
        },
        enumerable: false,
        configurable: true
    });
    return JunctionReference;
}(DocumentReference));
exports.JunctionReference = JunctionReference;
var CrawlerReference = /** @class */ (function (_super) {
    __extends(CrawlerReference, _super);
    function CrawlerReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CrawlerReference.prototype, "operations", {
        get: function () {
            return new CollectionReference(this.ref.collection("crawlerOperations"), OperationReference);
            ;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CrawlerReference.prototype, "caches", {
        get: function () {
            return new CollectionReference(this.ref.collection("crawlerCaches"), DocumentReference);
            ;
        },
        enumerable: false,
        configurable: true
    });
    return CrawlerReference;
}(DocumentReference));
exports.CrawlerReference = CrawlerReference;
var OperationReference = /** @class */ (function (_super) {
    __extends(OperationReference, _super);
    function OperationReference() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(OperationReference.prototype, "tasks", {
        get: function () {
            return new CollectionReference(this.ref.collection("crawlerTasks"), DocumentReference);
            ;
        },
        enumerable: false,
        configurable: true
    });
    return OperationReference;
}(DocumentReference));
exports.OperationReference = OperationReference;
var Reference = /** @class */ (function () {
    function Reference() {
    }
    Object.defineProperty(Reference.prototype, "contents", {
        get: function () {
            return new CollectionReference(db.collection("contents"), JunctionReference);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Reference.prototype, "crawlers", {
        get: function () {
            return new CollectionReference(db.collection("crawlers"), CrawlerReference);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Reference.prototype, "users", {
        get: function () {
            return new CollectionReference(db.collection("users"), UserReference);
        },
        enumerable: false,
        configurable: true
    });
    return Reference;
}());
exports.Reference = Reference;
var Batch = /** @class */ (function () {
    function Batch() {
        this.batch = db.batch();
    }
    Batch.prototype.create = function (ref, data) {
        this.batch.create(ref.ref, data);
    };
    Batch.prototype.update = function (ref, data) {
        this.batch.update(ref.ref, data);
    };
    Batch.prototype.delete = function (ref) {
        this.batch.delete(ref.ref);
    };
    Batch.prototype.commit = function () {
        return this.batch.commit();
    };
    return Batch;
}());
exports.Batch = Batch;
function increment(num) {
    return admin.firestore.FieldValue.increment(num);
}
exports.increment = increment;
exports.auth = admin.auth();
//# sourceMappingURL=client_firestore.js.map