/* eslint-disable @typescript-eslint/no-this-alias */
import { Receiver } from '../interfaces';
import { EventSubscriberService } from '../constants';

export function Subscribe(receiver: Receiver): MethodDecorator {
  const service = EventSubscriberService;
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const TargetCtor = target.constructor;
    const instance = new TargetCtor();
    const handler = descriptor.value.bind(instance);
    service.subscribe(receiver, handler);
    return instance;
  };
}
