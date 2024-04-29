import { ServiceBusError, ServiceBusReceivedMessage } from '@azure/service-bus';
import createMessageHandlers from './create-message-handlers';

import * as handleMessage from './handle-message';
describe('GIVEN createMessageHandlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('WHEN processMessage THEN handleMessage should be called with correct params', async () => {
    const handler = jest.fn();
    const message: ServiceBusReceivedMessage = {
      _rawAmqpMessage: { body: { test: 'test' } },
      body: { test: 'test' },
      state: 'active',
    };
    jest.spyOn(handleMessage, 'default').mockImplementation(jest.fn());
    const messageHandler = createMessageHandlers(handler);
    await messageHandler.processMessage(message);
    expect(handleMessage.default).toHaveBeenCalledWith(message, handler);
  });

  test('WHEN processError THEN an error should be thrown', async () => {
    const handler = jest.fn();
    const message: ServiceBusReceivedMessage = {
      _rawAmqpMessage: { body: { test: 'test' } },
      body: { test: 'test' },
      state: 'active',
    };
    const messageHandler = createMessageHandlers(handler);
    expect(
      messageHandler.processError({
        entityPath: '',
        error: { message: 'test', code: 'GeneralError', name: 'name' },
        errorSource: 'receive',
        fullyQualifiedNamespace: 'namespace',
        identifier: 'identifier',
      }),
    ).rejects.toThrow();
    expect(handleMessage.default).toHaveBeenCalledTimes(0);
  });
});
