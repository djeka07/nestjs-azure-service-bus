import { AppService } from './app.service';
import { AzureServiceBusClient } from '../dist';
export declare class AppController {
    readonly azureServiceBusClient: AzureServiceBusClient;
    readonly appService: AppService;
    constructor(azureServiceBusClient: AzureServiceBusClient, appService: AppService);
    getHello(): string;
}
