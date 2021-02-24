"use strict";
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
exports.Command = exports.Repository = void 0;
var typeorm_1 = require("typeorm");
var EntityPersistExecutor_1 = require("typeorm/persistence/EntityPersistExecutor");
var SelectQueryBuilder_1 = require("typeorm/query-builder/SelectQueryBuilder");
var PlainObjectToNewEntityTransformer_1 = require("typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer");
var Repository = /** @class */ (function () {
    function Repository(connection, metadata) {
        this.plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
        this.connection = connection;
        this.metadata = metadata;
    }
    Repository.prototype.createCommand = function (transaction) {
        return new Command(this, transaction);
    };
    Repository.prototype.createQuery = function (transaction) {
        return new SelectQueryBuilder_1.SelectQueryBuilder(this.connection, transaction === null || transaction === void 0 ? void 0 : transaction.queryRunner)
            .select(Repository.defaultAlias)
            .from(this.metadata.target, Repository.defaultAlias);
    };
    Repository.defaultAlias = "x";
    return Repository;
}());
exports.Repository = Repository;
var Command = /** @class */ (function () {
    function Command(repository, transaction) {
        this.plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
        this.transaction = transaction;
        this.repository = repository;
        this.queryRunner = transaction.queryRunner;
    }
    Command.prototype.createQuery = function () {
        return this.repository.createQuery(this.transaction);
    };
    Command.prototype.create = function (plainObjectOrObjects) {
        var _this = this;
        if (!plainObjectOrObjects)
            return this.repository.metadata.create(this.queryRunner);
        if (Array.isArray(plainObjectOrObjects))
            return plainObjectOrObjects.map(function (plainEntityLike) { return _this.create(plainEntityLike); });
        var mergeIntoEntity = this.repository.metadata.create(this.queryRunner);
        this.plainObjectToEntityTransformer.transform(mergeIntoEntity, plainObjectOrObjects, this.repository.metadata, true);
        return mergeIntoEntity;
    };
    Command.prototype.save = function (entity, maybeOptions) {
        if (Array.isArray(entity) && entity.length === 0)
            return Promise.resolve(entity);
        return new EntityPersistExecutor_1.EntityPersistExecutor(this.repository.connection, this.queryRunner, "save", this.repository.metadata.target, entity, maybeOptions)
            .execute()
            .then(function () { return entity; });
    };
    Command.prototype.update = function (criteria, partialEntity) {
        // if user passed empty criteria or empty list of criterias, then throw an error
        if (criteria === undefined ||
            criteria === null ||
            criteria === "" ||
            (Array.isArray(criteria) && criteria.length === 0)) {
            return Promise.reject(new Error("Empty criteria(s) are not allowed for the update method."));
        }
        if (typeof criteria === "string" ||
            typeof criteria === "number" ||
            criteria instanceof Date ||
            Array.isArray(criteria)) {
            return this.createQuery()
                .update(this.repository.metadata.target)
                .set(partialEntity)
                .whereInIds(criteria)
                .execute();
        }
        else {
            return this.createQuery()
                .update(this.repository.metadata.target)
                .set(partialEntity)
                .where(criteria)
                .execute();
        }
    };
    Command.prototype.delete = function (criteria) {
        // if user passed empty criteria or empty list of criterias, then throw an error
        if (criteria === undefined ||
            criteria === null ||
            criteria === "" ||
            (Array.isArray(criteria) && criteria.length === 0)) {
            return Promise.reject(new Error("Empty criteria(s) are not allowed for the delete method."));
        }
        if (typeof criteria === "string" ||
            typeof criteria === "number" ||
            criteria instanceof Date ||
            Array.isArray(criteria)) {
            return this.repository.createQuery(this.transaction)
                .delete()
                .from(this.repository.metadata.target)
                .whereInIds(criteria)
                .execute();
        }
        else {
            return this.repository.createQuery(this.transaction)
                .delete()
                .from(this.repository.metadata.target)
                .where(criteria)
                .execute();
        }
    };
    Command.prototype.increment = function (conditions, propertyPath, value) {
        return __awaiter(this, void 0, void 0, function () {
            var column, expression, values;
            var _this = this;
            return __generator(this, function (_a) {
                column = this.repository.metadata.findColumnWithPropertyPath(propertyPath);
                if (!column)
                    throw new Error("Column " + propertyPath + " was not found in " + this.repository.metadata.targetName + " entity.");
                if (isNaN(Number(value)))
                    throw new Error("Value \"" + value + "\" is not a number.");
                expression = value >= 0 ? " + " + value : " - " + (-value);
                values = propertyPath
                    .split(".")
                    .reduceRight(function (value, key) {
                    var _a;
                    return (_a = {}, _a[key] = value, _a);
                }, function () { return _this.repository.connection.driver.escape(column.databaseName) + expression; });
                return [2 /*return*/, this.repository
                        .createQuery()
                        .update(this.repository.metadata.target)
                        .set(values)
                        .where(conditions)
                        .execute()];
            });
        });
    };
    Command.prototype.findOne = function (idOrOptionsOrConditions, findOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var options, qb, passedId, findManyOptions;
            return __generator(this, function (_a) {
                options = undefined;
                if (idOrOptionsOrConditions instanceof Object) {
                    options = idOrOptionsOrConditions;
                }
                qb = this.createQuery();
                if (!findOptions || findOptions.loadEagerRelations !== false)
                    typeorm_1.FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias.metadata);
                passedId = typeof idOrOptionsOrConditions === "string" || typeof idOrOptionsOrConditions === "number" || idOrOptionsOrConditions instanceof Date;
                findManyOptions = findOptions;
                if (!passedId) {
                    findManyOptions = __assign(__assign({}, (findOptions || {})), { take: 1 });
                }
                typeorm_1.FindOptionsUtils.applyOptionsToQueryBuilder(qb, findManyOptions);
                if (options) {
                    qb.where(options);
                }
                else if (passedId) {
                    qb.andWhereInIds(this.repository.metadata.ensureEntityIdMap(idOrOptionsOrConditions));
                }
                return [2 /*return*/, qb.getOne()];
            });
        });
    };
    Command.prototype.find = function (optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var qb;
            return __generator(this, function (_a) {
                qb = this.createQuery();
                if (!typeorm_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions) || optionsOrConditions.loadEagerRelations !== false)
                    typeorm_1.FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.repository.metadata);
                return [2 /*return*/, typeorm_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getMany()];
            });
        });
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Repository.js.map