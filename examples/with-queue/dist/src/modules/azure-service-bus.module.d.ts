import { Provider } from '@nestjs/common';
import { AzureServiceBusProviderAsyncOptions, BaseAzureServiceBusProviderAsyncOption } from '../interfaces';
export declare class AzureServiceBusModule {
    static forAsyncRoot(options: Array<AzureServiceBusProviderAsyncOptions> | BaseAzureServiceBusProviderAsyncOption): {
        module: typeof AzureServiceBusModule;
        imports: any[];
        providers: Provider[];
        exports: Provider[];
    };
    private static createAsyncOptionsProvider;
    private static createFactoryWrapper;
    private static assignOnAppShutdownHook;
}
