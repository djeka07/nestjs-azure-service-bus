import { AzureServiceBusMessage } from '../../../src/interfaces';
export declare class AppService {
    getHello(): string;
    onMessage(data: AzureServiceBusMessage<{
        test: string;
    }>): void;
}
