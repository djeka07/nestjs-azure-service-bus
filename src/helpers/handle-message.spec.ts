import { ServiceBusReceivedMessage } from '@azure/service-bus';
import handleMessage from './handle-message';

describe('GIVEN handleMessage', () => {
  test('WHEN handleMessage THEN handler should be called with proprties that has values', async () => {
    const _rawAmqpMessage = {
      body: {},
    };

    const message: Omit<ServiceBusReceivedMessage, '_rawAmqpMessage'> = {
      body: { test: 'test' },
      state: 'active',
    };
    const handler = jest.fn();
    handleMessage({ ...message, _rawAmqpMessage }, handler);
    expect(handler).toHaveBeenCalledWith(message);
  });
});
