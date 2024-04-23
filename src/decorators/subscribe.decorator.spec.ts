import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Subscribe } from './subscribe.decorator';
import { AZURE_SERVICE_BUS_SUBSCRIBER } from '../constants';
import { Reflector } from '@nestjs/core';

jest.mock('@nestjs/common');

describe('GIVEN Subscribe', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('WHEN Subscribe is used as a decorator with only name THEN SetMetaData should be called with a receiver with name', () => {
    const test = (target, key, descriptor) => {
      return target;
    };
    test.KEY = 'key' as any;
    jest.mocked(SetMetadata).mockReturnValue(test as CustomDecorator<unknown>);
    Subscribe({ name: 'test' })('', '', {});
    expect(SetMetadata).toHaveBeenCalledWith(AZURE_SERVICE_BUS_SUBSCRIBER, {
      callback: undefined,
      methodName: '',
      receiver: {
        name: 'test',
      },
      target: 'String',
    });
  });

  test('WHEN Subscribe is used as a decorator with name and subscription THEN SetMetaData should be called with a receiver with name and subscription', () => {
    const test = (target, key, descriptor) => {
      return target;
    };
    test.KEY = 'key' as any;
    jest.mocked(SetMetadata).mockReturnValue(test as CustomDecorator<unknown>);
    Subscribe({ name: 'test', subscription: 'test' })('', '', {});
    expect(SetMetadata).toHaveBeenCalledWith(AZURE_SERVICE_BUS_SUBSCRIBER, {
      callback: undefined,
      methodName: '',
      receiver: {
        name: 'test',
        subscription: 'test',
      },
      target: 'String',
    });
  });
});
