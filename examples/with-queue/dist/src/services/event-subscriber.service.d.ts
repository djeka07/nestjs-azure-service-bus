import { EventSubscriberServiceInterface, Receiver } from '../interfaces';
export declare class EventSubscriberService implements EventSubscriberServiceInterface {
    private subscriptions;
    invoke<T>(key: string, payload: T): void;
    subscribe(receiver: Receiver, handler: (payload?: unknown) => void): void;
}
