import {
  Global,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { AzureServiceBusClient } from '../clients/azure-service-bus.client';
import {
  AZURE_SERVICE_BUS_SUBSCRIBER,
  EventSubscriberService,
} from '../constants/azure-service-bus.constants';
import {
  AzureServiceBusProviderAsyncOptions,
  BaseAzureServiceBusProviderAsyncOption,
  Receiver,
} from '../interfaces';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [],
})
export class AzureServiceBusModule implements OnModuleInit {
  eventSubscribe: typeof EventSubscriberService;
  constructor(private readonly discover: DiscoveryService) {
    this.eventSubscribe = EventSubscriberService;
  }
  async onModuleInit() {
    const [providerMethods, controllerMethods] = await Promise.all([
      this.discover.providerMethodsWithMetaAtKey<{
        receiver: Receiver;
      }>(AZURE_SERVICE_BUS_SUBSCRIBER),
      this.discover.controllerMethodsWithMetaAtKey<{
        receiver: Receiver;
      }>(AZURE_SERVICE_BUS_SUBSCRIBER),
    ]);
    const methods = [...providerMethods, ...controllerMethods];
    if (methods?.length > 0) {
      methods.forEach((meta) => {
        const handler = meta.discoveredMethod.handler.bind(
          meta.discoveredMethod.parentClass.instance,
        );
        this.eventSubscribe.subscribe(meta.meta.receiver, handler);
      });
    }
  }

  public static forAsyncRoot(
    options:
      | Array<AzureServiceBusProviderAsyncOptions>
      | BaseAzureServiceBusProviderAsyncOption,
  ) {
    const optns = Array.isArray(options) ? options : [options];

    const providers: Provider[] = optns.reduce(
      (accProviders: Provider[], item: AzureServiceBusProviderAsyncOptions) =>
        accProviders
          .concat(this.createAsyncOptionsProvider(item))
          .concat(item.extraProviders || []),
      [],
    );

    const imports = optns.reduce(
      (accImports: any, option: AzureServiceBusProviderAsyncOptions) =>
        option.imports && !accImports.includes(option.imports)
          ? accImports.concat(option.imports)
          : accImports,
      [],
    );

    return {
      module: AzureServiceBusModule,
      imports: [...imports],
      providers: [...providers],
      exports: [...providers],
    };
  }

  private static createAsyncOptionsProvider(
    options: AzureServiceBusProviderAsyncOptions,
  ): Provider[] {
    return [
      {
        provide: options.name || AzureServiceBusClient,
        useFactory: this.createFactoryWrapper(options.name, options.useFactory),
        inject: [...(options.inject || [])],
      },
    ];
  }

  private static createFactoryWrapper(
    name: AzureServiceBusProviderAsyncOptions['name'],
    useFactory: AzureServiceBusProviderAsyncOptions['useFactory'],
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory(...args);
      const clientProxyRef = new AzureServiceBusClient(
        { ...clientOptions, name },
        EventSubscriberService,
      );
      return this.assignOnAppShutdownHook(clientProxyRef);
    };
  }

  private static assignOnAppShutdownHook(client) {
    (client as unknown as OnApplicationShutdown).onApplicationShutdown =
      client.close;
    return client;
  }
}
