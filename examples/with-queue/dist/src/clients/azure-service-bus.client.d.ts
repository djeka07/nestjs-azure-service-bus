import { ServiceBusReceivedMessage, ServiceBusReceiver, ServiceBusSender } from '@azure/service-bus';
import { EventSubscriberService } from '../constants';
import { AzureServiceBusEmit, AzureServiceBusOptions } from '../interfaces';
export declare class AzureServiceBusClient {
    private readonly config;
    private readonly eventSubscriberService;
    private serviceBusClient;
    sender?: Record<string, ServiceBusSender>;
    receiver?: Record<string, ServiceBusReceiver>;
    private clientConfig;
    constructor(config: AzureServiceBusOptions, eventSubscriberService: typeof EventSubscriberService);
    emit<T>(data: AzureServiceBusEmit<T>): Promise<void>;
    checkScheduleDate(updateTime: Date): boolean;
    close(): Promise<void>;
    private createMessageHandlers;
    handleMessage(receivedMessage: ServiceBusReceivedMessage, key: string): void;
}
