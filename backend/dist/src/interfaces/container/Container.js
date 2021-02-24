"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFocusedContainer = exports.toRelatedContainer = void 0;
var Format_1 = require("../format/Format");
var Space_1 = require("../space/Space");
var Utils_1 = require("../Utils");
function toRelatedContainer(container) {
    return {
        containerId: container.entityId,
        space: Space_1.toRelatedSpace(container.space),
        format: Format_1.toRelatedFormat(container.format),
        createdAt: Utils_1.toTimestamp(container.createdAt),
        updatedAt: Utils_1.toTimestamp(container.updatedAt),
        generator: container.generator
    };
}
exports.toRelatedContainer = toRelatedContainer;
function toFocusedContainer(container, reactor) {
    return {
        containerId: container.entityId,
        space: Space_1.toRelatedSpace(container.space),
        format: Format_1.toRelatedFormat(container.format),
        createdAt: Utils_1.toTimestamp(container.createdAt),
        updatedAt: Utils_1.toTimestamp(container.updatedAt),
        generator: container.generator,
        reactor: reactor
    };
}
exports.toFocusedContainer = toFocusedContainer;
//# sourceMappingURL=Container.js.map