import {
  Global,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { AzureServiceBusClient } from '../clients/azure-service-bus.client';
import { AZURE_SERVICE_BUS_SENDER } from '../constants';
import { toUpper } from '../helpers';
import {
  AzureServiceBusOptions,
  AzureServiceBusProviderAsyncOption,
  ExploredClass,
  ExploredMethodWithMeta,
  Receiver,
  Sender,
} from '../interfaces';
import { ExplorerService } from '../services/explorer.service';
@Global()
@Module({
  imports: [],
  providers: [ExplorerService, MetadataScanner],
})
export class AzureServiceBusModule implements OnModuleInit {
  constructor(private readonly explorerService: ExplorerService) {}
  async onModuleInit() {
    const [azureServiceBusClients, subscribeMethods] = await Promise.all([
      this.explorerService.getAzureServiceBusClientProviders(),
      this.explorerService.getMethodsWithSubscriberKey(),
    ]);
    this.registerSubscribeMethods(subscribeMethods, azureServiceBusClients);
  }

  private registerSubscribeMethods(
    methods: ExploredMethodWithMeta<{
      receiver: Receiver;
    }>[],
    azureServiceBusClients: ExploredClass<AzureServiceBusClient>[],
  ) {
    if (methods?.length > 0) {
      methods.forEach((method) => {
        const handler = method.discoveredMethod.handler.bind(
          method.discoveredMethod.parentClass.instance,
        );
        const azureServiceBus = azureServiceBusClients?.find(
          (client) => client.name === AzureServiceBusClient.name,
        );
        if (!azureServiceBus) {
          throw new Error(
            `Could not find any registered servicebus client with name ${AzureServiceBusClient.name}`,
          );
        }
        azureServiceBus.instance.subscribe(method.meta.receiver, handler);
      });
    }
  }

  public static forRoot(option: AzureServiceBusOptions) {
    const providers = [
      {
        provide: AzureServiceBusClient,
        useValue: new AzureServiceBusClient(option),
      },
    ];
    return {
      module: AzureServiceBusModule,
      providers,
      exports: providers,
    };
  }

  public static forRootAsync(option: AzureServiceBusProviderAsyncOption) {
    const providers: Provider[] = this.createAsyncOptionsProvider(
      option,
    ).concat(option.extraProviders || []);

    return {
      module: AzureServiceBusModule,
      imports: option.imports,
      providers,
      exports: providers,
    };
  }

  private static createAsyncOptionsProvider(
    options: AzureServiceBusProviderAsyncOption,
  ): Provider[] {
    return [
      {
        provide: AzureServiceBusClient,
        useFactory: this.createFactoryWrapper(options.useFactory),
        inject: [...(options.inject || [])],
      },
    ];
  }

  private static createFactoryWrapper(
    useFactory: AzureServiceBusProviderAsyncOption['useFactory'],
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory(...args);
      const clientProxyRef = new AzureServiceBusClient({
        ...clientOptions,
      });
      return this.assignOnAppShutdownHook(clientProxyRef);
    };
  }

  public static forFeature(senders: Sender[]) {
    const providers =
      senders?.map((queue) => ({
        provide: `${AZURE_SERVICE_BUS_SENDER}${toUpper(queue.name)}`,
        useFactory: (client: AzureServiceBusClient) =>
          client.register(queue.name),
        inject: [AzureServiceBusClient],
      })) || [];

    return {
      module: AzureServiceBusModule,
      providers: [...providers],
      exports: [...providers],
    };
  }

  private static assignOnAppShutdownHook(client) {
    (client as unknown as OnApplicationShutdown).onApplicationShutdown =
      client.close;
    return client;
  }
}
