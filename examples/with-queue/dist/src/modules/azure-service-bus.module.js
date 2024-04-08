"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AzureServiceBusModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureServiceBusModule = void 0;
const common_1 = require("@nestjs/common");
const azure_service_bus_client_1 = require("../clients/azure-service-bus.client");
const azure_service_bus_constants_1 = require("../constants/azure-service-bus.constants");
let AzureServiceBusModule = AzureServiceBusModule_1 = class AzureServiceBusModule {
    static forAsyncRoot(options) {
        const optns = Array.isArray(options) ? options : [options];
        const providers = optns.reduce((accProviders, item) => accProviders
            .concat(this.createAsyncOptionsProvider(item))
            .concat(item.extraProviders || []), []);
        const imports = optns.reduce((accImports, option) => option.imports && !accImports.includes(option.imports)
            ? accImports.concat(option.imports)
            : accImports, []);
        return {
            module: AzureServiceBusModule_1,
            imports: [...imports],
            providers: [...providers],
            exports: [...providers],
        };
    }
    static createAsyncOptionsProvider(options) {
        return [
            {
                provide: options.name || azure_service_bus_client_1.AzureServiceBusClient,
                useFactory: this.createFactoryWrapper(options.useFactory),
                inject: [...(options.inject || [])],
            },
        ];
    }
    static createFactoryWrapper(useFactory) {
        return async (...args) => {
            const clientOptions = await useFactory(...args);
            const clientProxyRef = new azure_service_bus_client_1.AzureServiceBusClient(clientOptions, azure_service_bus_constants_1.EventSubscriberService);
            return this.assignOnAppShutdownHook(clientProxyRef);
        };
    }
    static assignOnAppShutdownHook(client) {
        client.onApplicationShutdown =
            client.close;
        return client;
    }
};
exports.AzureServiceBusModule = AzureServiceBusModule;
exports.AzureServiceBusModule = AzureServiceBusModule = AzureServiceBusModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AzureServiceBusModule);
//# sourceMappingURL=azure-service-bus.module.js.map