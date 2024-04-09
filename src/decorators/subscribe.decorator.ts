import { Receiver } from '../interfaces';
import { AZURE_SERVICE_BUS_SUBSCRIBER } from '../constants';
import { SetMetadata } from '@nestjs/common';

export const Subscribe = (receiver: Receiver) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(AZURE_SERVICE_BUS_SUBSCRIBER, {
      receiver,
      target: target.constructor.name,
      methodName: propertyKey,
      callback: descriptor.value,
    })(target, propertyKey, descriptor);
  };
};
