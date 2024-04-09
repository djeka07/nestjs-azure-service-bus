import { EventSubscriberService as Service } from '../services/event-subscriber.service';

export const AZURE_SERVICE_BUS_CONFIGURATION =
  'AZURE_SERVICE_BUS_CONFIGURATION';

export const AZURE_SERVICE_BUS_EVENT_SUBSCRIBER_CLIENT =
  'AZURE_SERVICE_BUS_EVENT_SUBSCRIBER_CLIENT';

export const AZURE_SERVICE_BUS_SUBSCRIBER = 'AZURE_SERVICE_BUS_SUBSCRIBER';
export const EventSubscriberService = new Service();
