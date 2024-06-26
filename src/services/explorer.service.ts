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
  private exploredClasses?: Promise<ExploredClass[]>;
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  private classMethodsWithMetaAtKey<T>(
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
    const methods = this.getProviderMethods<{ receiver: Receiver }>(
      AZURE_SERVICE_BUS_SUBSCRIBER,
    );

    return methods;
  }

  async getAzureServiceBusClientProviders(): Promise<
    ExploredClass<AzureServiceBusClient>[]
  > {
    return this.getExploredClasses(
      true,
      (x) => x.instance instanceof AzureServiceBusClient,
    ) as Promise<ExploredClass<AzureServiceBusClient>[]>;
  }

  private async getExploredClasses(
    excludeControllers: boolean = false,
    filter: Filter<ExploredClass> = () => true,
  ): Promise<ExploredClass[]> {
    if (!this.exploredClasses) {
      this.exploredClasses = this.explore(excludeControllers);
    }
    return (await this.exploredClasses).filter((x) => filter(x));
  }

  private async getProviderMethods<T>(
    metaKey: MetaKey,
    excludeControllers = false,
  ): Promise<ExploredMethodWithMeta<T>[]> {
    const providers = await this.getExploredClasses(excludeControllers);
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

  private async explore(excludeControllers: boolean = false) {
    const modulesMap = [...this.modulesContainer.entries()];
    return Promise.all(
      flatMap(modulesMap, ([key, nestModule]) => {
        const controllerComponents = excludeControllers
          ? []
          : [...(nestModule?.['controllers']?.values() || [])];
        const providerComponents = [
          ...(nestModule?.['providers']?.values() || []),
        ];
        return [...controllerComponents, ...providerComponents]
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toExploredClass(nestModule, component));
      }),
    );
  }
}
