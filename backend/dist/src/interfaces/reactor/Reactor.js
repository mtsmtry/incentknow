"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Container_1 = require("../container/Container");
var User_1 = require("../user/User");
var Utils_1 = require("../Utils");
function toIntactReactor(reactor) {
    var _a;
    return {
        reactorId: reactor.entityId,
        container: Container_1.toRelatedContainer(reactor.container),
        state: reactor.state,
        definitionId: ((_a = reactor.definition) === null || _a === void 0 ? void 0 : _a.entityId) || null,
        createdAt: Utils_1.toTimestamp(reactor.createdAt),
        creatorUser: User_1.toRelatedUser(reactor.creatorUser)
    };
}
//# sourceMappingURL=Reactor.js.map