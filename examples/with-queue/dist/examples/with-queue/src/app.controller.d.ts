import { AppService } from './app.service';
import { AzureServiceBusClient } from '../../../src/clients/azure-service-bus.client';
export declare class AppController {
    private readonly appService;
    private readonly azureServiceBusClient;
    constructor(appService: AppService, azureServiceBusClient: AzureServiceBusClient);
    getHello(): string;
}
