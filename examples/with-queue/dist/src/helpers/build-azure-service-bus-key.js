"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (queue, subscription) => {
    if (!subscription) {
        return queue;
    }
    return `${queue}/${subscription}`;
};
//# sourceMappingURL=build-azure-service-bus-key.js.map