import buildAzureServiceBusKey from '../helpers/build-azure-service-bus-receiver-key';
import { EventSubscriberServiceInterface, Receiver } from '../interfaces';

export class EventSubscriberService implements EventSubscriberServiceInterface {
  private subscriptions = new Map<string, (payload?: unknown) => void>();

  invoke<T>(key: string, payload: T): void {
    const handler = this.subscriptions.get(key);
    if (!!handler) {
      handler(payload);
    }
  }

  subscribe(receiver: Receiver, handler: (payload?: unknown) => void): void {
    const key = buildAzureServiceBusKey(receiver);
    if (this.subscriptions.get(key)) {
      throw new Error(`Key ${key} has already been registered`);
    }
    this.subscriptions.set(key, handler);
  }
}
