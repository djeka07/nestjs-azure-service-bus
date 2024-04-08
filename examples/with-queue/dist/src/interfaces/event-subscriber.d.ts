import { Receiver } from './azure-service-bus-options';
export interface EventSubscriberServiceInterface {
    invoke<T>(key: string, data: T): void;
    subscribe(receiver: Receiver, handler: (payload?: unknown) => void): void;
}
