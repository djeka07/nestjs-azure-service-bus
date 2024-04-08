"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubscriberService = void 0;
const build_azure_service_bus_key_1 = require("../helpers/build-azure-service-bus-key");
class EventSubscriberService {
    constructor() {
        this.subscriptions = new Map();
    }
    invoke(key, payload) {
        const handler = this.subscriptions.get(key);
        handler(payload);
    }
    subscribe(receiver, handler) {
        this.subscriptions.set((0, build_azure_service_bus_key_1.default)(receiver.name, receiver.subscription), handler);
    }
}
exports.EventSubscriberService = EventSubscriberService;
//# sourceMappingURL=event-subscriber.service.js.map