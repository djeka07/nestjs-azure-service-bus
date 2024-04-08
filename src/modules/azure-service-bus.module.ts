import {
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { AzureServiceBusClient } from '../clients/azure-service-bus.client';
import { EventSubscriberService } from '../constants/azure-service-bus.constants';
import {
  AzureServiceBusProviderAsyncOptions,
  BaseAzureServiceBusProviderAsyncOption,
} from '../interfaces';

@Global()
@Module({})
export class AzureServiceBusModule {
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
        useFactory: this.createFactoryWrapper(options.useFactory),
        inject: [...(options.inject || [])],
      },
    ];
  }

  private static createFactoryWrapper(
    useFactory: AzureServiceBusProviderAsyncOptions['useFactory'],
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory(...args);
      const clientProxyRef = new AzureServiceBusClient(
        clientOptions,
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
