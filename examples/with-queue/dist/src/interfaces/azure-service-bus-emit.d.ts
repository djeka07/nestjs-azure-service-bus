import { OperationOptionsBase, ServiceBusMessage } from '@azure/service-bus';
type AzureServiceBusPayload<T> = Omit<ServiceBusMessage, 'body'> & {
    body: T;
};
export interface AzureServiceBusEmit<T> {
    payload: AzureServiceBusPayload<T> | AzureServiceBusPayload<T>[];
    name: string;
    options?: OperationOptionsBase;
    updateTime?: Date;
}
export interface AzureServiceBusMessage<T> {
    replyTo?: string;
    deliveryCount: number;
    body: T;
    messageId: string;
    state: string;
    enqueuedTimeUtc: Date;
    lockedUntilUtc: Date;
    expiresAtUtc: Date;
    timeToLive: number;
    lockToken: string;
    deadLetterReason?: string;
    deadLetterErrorDescription?: string;
}
export {};
