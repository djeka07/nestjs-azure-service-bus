"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubscriberService = exports.AZURE_SERVICE_BUS_EVENT_SUBSCRIBER = exports.AZURE_SERVICE_BUS_CONFIGURATION = void 0;
const event_subscriber_service_1 = require("../services/event-subscriber.service");
exports.AZURE_SERVICE_BUS_CONFIGURATION = 'AZURE_SERVICE_BUS_CONFIGURATION';
exports.AZURE_SERVICE_BUS_EVENT_SUBSCRIBER = 'AZURE_SERVICE_BUS_EVENT_SUBSCRIBER';
exports.EventSubscriberService = new event_subscriber_service_1.EventSubscriberService();
//# sourceMappingURL=azure-service-bus.constants.js.map