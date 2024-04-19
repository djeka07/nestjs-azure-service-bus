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
import { AZURE_SERVICE_BUS_CONFIGURATION } from '../constants';
import buildAzureServiceBusKey from '../helpers/build-azure-service-bus-receiver-key';
import {
  AzureServiceBusEmit,
  AzureServiceBusMessage,
  AzureServiceBusOptionsWithName,
  Receiver,
} from '../interfaces';
import { Emit } from '../interfaces';

export class AzureServiceBusClient {
  private serviceBusClient: ServiceBusClient;
  public sender?: Record<string, ServiceBusSender>;
  public receiver?: Record<string, ServiceBusReceiver>;
  public clientConfig: ServiceBusConnectionStringProperties;

  constructor(
    @Inject(AZURE_SERVICE_BUS_CONFIGURATION)
    private readonly config: AzureServiceBusOptionsWithName,
  ) {
    this.serviceBusClient = new ServiceBusClient(config.connectionString);
    this.clientConfig = parseServiceBusConnectionString(
      config.connectionString,
    );
    this.receiver = {};
    this.sender = {};
  }

  register(name: string): Promise<Emit> {
    if (!this.sender[name]) {
      this.sender[name] = this.serviceBusClient.createSender(name);
    }
    return this.emit(name);
  }

  subscribe(receiver: Receiver, handler: (payload?: unknown) => void) {
    const key = buildAzureServiceBusKey(receiver);
    if (!this.receiver?.[key]) {
      this.receiver[key] = this.serviceBusClient.createReceiver(
        receiver.name,
        receiver.subscription,
      );
      this.receiver[key].subscribe(this.createMessageHandlers(handler));
    }
  }

  async emit<T>(queue: string): Promise<Emit> {
    return (data: AzureServiceBusEmit<T>) => {
      return this.privateEmit(queue, data);
    };
  }

  private async privateEmit<T>(
    name: string,
    data: AzureServiceBusEmit<T>,
  ): Promise<void> {
    const { payload, updateTime, options } = data;
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

  private createMessageHandlers(
    handler: (payload?: unknown) => void,
  ): MessageHandlers {
    return {
      processMessage: async (receivedMessage: ServiceBusReceivedMessage) => {
        this.handleMessage(receivedMessage, handler);
      },
      processError: (args: ProcessErrorArgs): Promise<void> => {
        return new Promise<void>(() => {
          throw new Error(`Error processing message: ${args.error}`);
        });
      },
    };
  }

  handleMessage(
    receivedMessage: ServiceBusReceivedMessage,
    handler: (payload?: unknown) => void,
  ): void {
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
      handler({
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
