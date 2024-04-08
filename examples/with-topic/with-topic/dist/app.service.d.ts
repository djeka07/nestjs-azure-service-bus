import { AzureServiceBusMessage } from '../dist';
export declare class AppService {
    getHello(): string;
    sub(data: AzureServiceBusMessage<{
        hej: string;
    }>): void;
}
