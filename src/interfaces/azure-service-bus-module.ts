import { ModuleMetadata, Provider, Type } from '@nestjs/common/interfaces';
import { AzureServiceBusOptions } from './azure-service-bus-options';

export interface AzureServiceBusModuleOptionsFactory {
  createAsyncOptionsProvider():
    | Promise<AzureServiceBusOptions>
    | AzureServiceBusOptions;
}

export interface AzureServiceBusProviderAsyncOption
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AzureServiceBusModuleOptionsFactory>;
  useClass?: Type<AzureServiceBusModuleOptionsFactory>;
  useFactory: (
    ...args: any[]
  ) => Promise<AzureServiceBusOptions> | AzureServiceBusOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
