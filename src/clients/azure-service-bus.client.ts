import {
  MessageHandlers,
  ProcessErrorArgs,
  ServiceBusClient,
  ServiceBusConnectionStringProperties,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
  ServiceBusSender,
  parseServiceBusConnectionString,
} from '@azure/service-bus';
import { Inject } from '@nestjs/common';
import {
  AZURE_SERVICE_BUS_CONFIGURATION,
  AZURE_SERVICE_BUS_EVENT_SUBSCRIBER,
  EventSubscriberService,
} from '../constants';
import buildAzureServiceBusKey from '../helpers/build-azure-service-bus-key';
import {
  AzureServiceBusEmit,
  AzureServiceBusMessage,
  AzureServiceBusOptions,
} from '../interfaces';

export class AzureServiceBusClient {
  private serviceBusClient: ServiceBusClient;
  public sender?: Record<string, ServiceBusSender>;
  public receiver?: Record<string, ServiceBusReceiver>;
  private clientConfig: ServiceBusConnectionStringProperties;

  constructor(
    @Inject(AZURE_SERVICE_BUS_CONFIGURATION)
    private readonly config: AzureServiceBusOptions,
    @Inject(AZURE_SERVICE_BUS_EVENT_SUBSCRIBER)
    private readonly eventSubscriberService: typeof EventSubscriberService,
  ) {
    this.serviceBusClient = new ServiceBusClient(config.connectionString);
    this.clientConfig = parseServiceBusConnectionString(
      config.connectionString,
    );
    this.sender =
      !!config.senders && config.senders.length > 0
        ? config.senders?.reduce((acc, curr) => {
            return {
              ...acc,
              [curr.name]: this.serviceBusClient.createSender(curr.name, {
                identifier: curr.identifier,
              }),
            };
          }, {})
        : undefined;
    console.log(Object.keys(config.receivers));
    this.receiver =
      !!config.receivers && config.receivers?.length > 0
        ? config.receivers.reduce?.((acc, curr) => {
            return {
              ...acc,
              [buildAzureServiceBusKey(curr.name, curr.subscription)]:
                this.serviceBusClient.createReceiver(
                  curr.name,
                  curr.subscription,
                ),
            };
          }, {})
        : undefined;
    if (!!this.receiver) {
      for (const key in this.receiver) {
        this.receiver[key].subscribe(this.createMessageHandlers(key));
      }
    }
  }

  async emit<T>(data: AzureServiceBusEmit<T>): Promise<void> {
    const { payload, updateTime, options, name } = data;
    console.log('payload', payload);
    const sender = this.sender?.[name];
    if (!!sender) {
      if (updateTime && this.checkScheduleDate(updateTime)) {
        await sender.scheduleMessages(payload, updateTime, options);
        return;
      }
      await sender.sendMessages(payload, options);
    }
  }

  checkScheduleDate(updateTime: Date) {
    if (updateTime instanceof Date) {
      return true;
    } else {
      throw new Error(
        `Error validating schedule date: ${updateTime} is not valid`,
      );
    }
  }

  async close(): Promise<void> {
    if (!!this.sender) {
      for (const key in this.sender) {
        await this.sender[key]?.close();
      }
    }

    if (!!this.receiver) {
      for (const key in this.receiver) {
        for (const subKey in this.receiver[key]) {
          await this.receiver[key][subKey]?.close();
        }
      }
    }

    await this.serviceBusClient?.close();
  }

  private createMessageHandlers(key: string): MessageHandlers {
    return {
      processMessage: async (receivedMessage: ServiceBusReceivedMessage) => {
        console.log('message reviee');
        this.handleMessage(receivedMessage, key);
      },
      processError: (args: ProcessErrorArgs): Promise<void> => {
        console.log('error', args);
        return new Promise<void>(() => {
          throw new Error(`Error processing message: ${args.error}`);
        });
      },
    };
  }

  handleMessage(receivedMessage: ServiceBusReceivedMessage, key: string): void {
    try {
      const {
        body,
        deliveryCount,
        replyTo,
        messageId,
        state,
        enqueuedTimeUtc,
        lockedUntilUtc,
        expiresAtUtc,
        lockToken,
        timeToLive,
      } = receivedMessage;
      console.log('r', receivedMessage);
      this.eventSubscriberService.invoke(key, {
        body,
        replyTo,
        deliveryCount,
        messageId,
        state,
        enqueuedTimeUtc,
        lockedUntilUtc,
        expiresAtUtc,
        lockToken,
        timeToLive,
      } as AzureServiceBusMessage<unknown>);
    } catch (err) {
      throw err;
    }
  }
}
