import { Type } from '@nestjs/common';

export interface ExploredModule<T = object> {
  name: string;
  instance: T;
  // eslint-disable-next-line @typescript-eslint/ban-types
  injectType?: Function | Type<any>;
  dependencyType: Type<T>;
}

export interface ExploredClass<T = object> extends ExploredModule<T> {
  parentModule: ExploredModule<T>;
}

export interface ExploredMethod {
  handler: (...args: any[]) => any;
  methodName: string;
  parentClass: ExploredClass;
}

export interface ExploredMethodWithMeta<T> {
  discoveredMethod: ExploredMethod;
  meta: T;
}

export interface ExploredClassWithMeta<T> {
  discoveredClass: ExploredClass;
  meta: T;
}

export type MetaKey = string | number | symbol;

export type Filter<T> = (item: T) => boolean;
