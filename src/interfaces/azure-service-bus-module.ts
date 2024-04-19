import { ModuleMetadata, Provider, Type } from '@nestjs/common/interfaces';
import { AzureServiceBusOptions } from './azure-service-bus-options';

export type AzureServiceBusProvider = AzureServiceBusOptions;

export type AzureServiceBusProviderOptions = AzureServiceBusProvider & {
  name: string | symbol;
};

export type AzureServiceBusModuleOptions =
  Array<AzureServiceBusProviderOptions>;

export interface AzureServiceBusModuleOptionsFactory {
  createAsyncOptionsProvider():
    | Promise<AzureServiceBusProvider>
    | AzureServiceBusProvider;
}

export interface BaseAzureServiceBusProviderAsyncOption
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AzureServiceBusModuleOptionsFactory>;
  useClass?: Type<AzureServiceBusModuleOptionsFactory>;
  useFactory: (
    ...args: any[]
  ) => Promise<AzureServiceBusProvider> | AzureServiceBusProvider;
  inject?: any[];
  extraProviders?: Provider[];
}
