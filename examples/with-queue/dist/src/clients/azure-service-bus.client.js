"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureServiceBusClient = void 0;
const service_bus_1 = require("@azure/service-bus");
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const build_azure_service_bus_key_1 = require("../helpers/build-azure-service-bus-key");
let AzureServiceBusClient = class AzureServiceBusClient {
    constructor(config, eventSubscriberService) {
        var _a, _b, _c, _d;
        this.config = config;
        this.eventSubscriberService = eventSubscriberService;
        this.serviceBusClient = new service_bus_1.ServiceBusClient(config.connectionString);
        this.clientConfig = (0, service_bus_1.parseServiceBusConnectionString)(config.connectionString);
        this.sender =
            !!config.senders && config.senders.length > 0
                ? (_a = config.senders) === null || _a === void 0 ? void 0 : _a.reduce((acc, curr) => {
                    return Object.assign(Object.assign({}, acc), { [curr.name]: this.serviceBusClient.createSender(curr.name, {
                            identifier: curr.identifier,
                        }) });
                }, {})
                : undefined;
        console.log(Object.keys(config.receivers));
        this.receiver =
            !!config.receivers && ((_b = config.receivers) === null || _b === void 0 ? void 0 : _b.length) > 0
                ? (_d = (_c = config.receivers).reduce) === null || _d === void 0 ? void 0 : _d.call(_c, (acc, curr) => {
                    return Object.assign(Object.assign({}, acc), { [(0, build_azure_service_bus_key_1.default)(curr.name, curr.subscription)]: this.serviceBusClient.createReceiver(curr.name, curr.subscription) });
                }, {})
                : undefined;
        if (!!this.receiver) {
            for (const key in this.receiver) {
                this.receiver[key].subscribe(this.createMessageHandlers(key));
            }
        }
    }
    async emit(data) {
        var _a;
        const { payload, updateTime, options, name } = data;
        console.log('payload', payload);
        const sender = (_a = this.sender) === null || _a === void 0 ? void 0 : _a[name];
        if (!!sender) {
            if (updateTime && this.checkScheduleDate(updateTime)) {
                await sender.scheduleMessages(payload, updateTime, options);
                return;
            }
            await sender.sendMessages(payload, options);
        }
    }
    checkScheduleDate(updateTime) {
        if (updateTime instanceof Date) {
            return true;
        }
        else {
            throw new Error(`Error validating schedule date: ${updateTime} is not valid`);
        }
    }
    async close() {
        var _a, _b, _c;
        if (!!this.sender) {
            for (const key in this.sender) {
                await ((_a = this.sender[key]) === null || _a === void 0 ? void 0 : _a.close());
            }
        }
        if (!!this.receiver) {
            for (const key in this.receiver) {
                for (const subKey in this.receiver[key]) {
                    await ((_b = this.receiver[key][subKey]) === null || _b === void 0 ? void 0 : _b.close());
                }
            }
        }
        await ((_c = this.serviceBusClient) === null || _c === void 0 ? void 0 : _c.close());
    }
    createMessageHandlers(key) {
        return {
            processMessage: async (receivedMessage) => {
                console.log('message reviee');
                this.handleMessage(receivedMessage, key);
            },
            processError: (args) => {
                console.log('error', args);
                return new Promise(() => {
                    throw new Error(`Error processing message: ${args.error}`);
                });
            },
        };
    }
    handleMessage(receivedMessage, key) {
        try {
            const { body, deliveryCount, replyTo, messageId, state, enqueuedTimeUtc, lockedUntilUtc, expiresAtUtc, lockToken, timeToLive, } = receivedMessage;
            console.log('r', receivedMessage);
            this.eventSubscriberService.invoke(key, {
                body,
                replyTo,
                deliveryCount,
                messageId,
                state,
                enqueuedTimeUtc,
                lockedUntilUtc,
                expiresAtUtc,
                lockToken,
                timeToLive,
            });
        }
        catch (err) {
            throw err;
        }
    }
};
exports.AzureServiceBusClient = AzureServiceBusClient;
exports.AzureServiceBusClient = AzureServiceBusClient = __decorate([
    __param(0, (0, common_1.Inject)(constants_1.AZURE_SERVICE_BUS_CONFIGURATION)),
    __param(1, (0, common_1.Inject)(constants_1.AZURE_SERVICE_BUS_EVENT_SUBSCRIBER)),
    __metadata("design:paramtypes", [Object, Object])
], AzureServiceBusClient);
//# sourceMappingURL=azure-service-bus.client.js.map