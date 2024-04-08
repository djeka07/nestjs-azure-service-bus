import buildAzureServiceBusKey from '../helpers/build-azure-service-bus-key';
import { EventSubscriberServiceInterface, Receiver } from '../interfaces';

export class EventSubscriberService implements EventSubscriberServiceInterface {
  private subscriptions = new Map<string, (payload?: unknown) => void>();

  invoke<T>(key: string, payload: T): void {
    const handler = this.subscriptions.get(key);
    handler(payload);
  }

  subscribe(receiver: Receiver, handler: (payload?: unknown) => void): void {
    this.subscriptions.set(
      buildAzureServiceBusKey(receiver.name, receiver.subscription),
      handler,
    );
  }
}
