import { Injectable, Scope, Type } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import {
  ExploredClass,
  ExploredMethodWithMeta,
  Filter,
  MetaKey,
  Receiver,
} from '../interfaces';
import isNil from 'lodash.isnil';
import flatMap from 'lodash.flatmap';
import get from 'lodash.get';
import { AzureServiceBusClient } from '../clients';
import { AZURE_SERVICE_BUS_SUBSCRIBER } from '../constants/azure-service-bus.constants';

@Injectable()
export class ExplorerService {
  private exploredProviders?: Promise<ExploredClass[]>;
  private exploredControllers?: Promise<ExploredClass[]>;
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  classMethodsWithMetaAtKey<T>(
    component: ExploredClass,
    metaKey: MetaKey,
  ): ExploredMethodWithMeta<T>[] {
    const { instance } = component;

    if (!instance) {
      return [];
    }

    const prototype = Object.getPrototypeOf(instance);

    return this.metadataScanner
      .getAllMethodNames(prototype)
      .map((name) =>
        this.extractMethodMetaAtKey<T>(metaKey, component, prototype, name),
      )
      .filter((x) => !isNil(x.meta));
  }

  async getMethodsWithSubscriberKey(): Promise<
    ExploredMethodWithMeta<{ receiver: Receiver }>[]
  > {
    const methods = await Promise.all([
      this.getControllerMethods<{ receiver: Receiver }>(
        AZURE_SERVICE_BUS_SUBSCRIBER,
      ),
      this.getProviderMethods<{ receiver: Receiver }>(
        AZURE_SERVICE_BUS_SUBSCRIBER,
      ),
    ]);

    return flatMap(methods);
  }

  private async getControllerMethods<T>(
    metaKey: MetaKey,
  ): Promise<ExploredMethodWithMeta<T>[]> {
    const controllers = await this.getControllers();

    return flatMap(controllers, (controller) =>
      this.classMethodsWithMetaAtKey<T>(controller, metaKey),
    );
  }

  async getAzureServiceBusClientProviders(): Promise<
    ExploredClass<AzureServiceBusClient>[]
  > {
    return this.getProviders(
      (x) => x.instance instanceof AzureServiceBusClient,
    ) as Promise<ExploredClass<AzureServiceBusClient>[]>;
  }

  async getProviders(
    filter: Filter<ExploredClass> = () => true,
  ): Promise<ExploredClass[]> {
    if (!this.exploredProviders) {
      this.exploredProviders = this.explore('providers');
    }
    return (await this.exploredProviders).filter((x) => filter(x));
  }

  private async getControllers(
    filter: Filter<ExploredClass> = () => true,
  ): Promise<ExploredClass[]> {
    if (!this.exploredControllers) {
      this.exploredControllers = this.explore('controllers');
    }
    return (await this.exploredControllers).filter((x) => filter(x));
  }

  private async getProviderMethods<T>(
    metaKey: MetaKey,
  ): Promise<ExploredMethodWithMeta<T>[]> {
    const providers = await this.getProviders();
    return flatMap(providers, (provider) =>
      this.classMethodsWithMetaAtKey<T>(provider, metaKey),
    );
  }

  private extractMethodMetaAtKey<T>(
    metaKey: MetaKey,
    exploredClass: ExploredClass,
    prototype: any,
    methodName: string,
  ): ExploredMethodWithMeta<T> {
    const handler = prototype[methodName];
    const meta: T = Reflect.getMetadata(metaKey, handler);

    return {
      meta,
      discoveredMethod: {
        handler,
        methodName,
        parentClass: exploredClass,
      },
    };
  }

  private async toExploredClass(
    nestModule: Module,
    wrapper: InstanceWrapper<any>,
  ): Promise<ExploredClass> {
    const instanceHost = wrapper.getInstanceByContextId(
      STATIC_CONTEXT,
      wrapper && wrapper.id ? wrapper.id : undefined,
    );

    if (instanceHost.isPending && !instanceHost.isResolved) {
      await instanceHost.donePromise;
    }

    return {
      name: wrapper.name as string,
      instance: instanceHost.instance,
      injectType: wrapper.metatype,
      dependencyType: get(instanceHost, 'instance.constructor'),
      parentModule: {
        name: nestModule.metatype.name,
        instance: nestModule.instance,
        injectType: nestModule.metatype,
        dependencyType: nestModule.instance.constructor as Type<object>,
      },
    };
  }

  private async explore(component: 'providers' | 'controllers') {
    const modulesMap = [...this.modulesContainer.entries()];
    return Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      flatMap(modulesMap, ([key, nestModule]) => {
        const components = [...nestModule[component].values()];
        return components
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toExploredClass(nestModule, component));
      }),
    );
  }
}
