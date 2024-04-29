import { ServiceBusClient, ServiceBusReceiver } from '@azure/service-bus';
import { AzureServiceBusClient } from './azure-service-bus.client';

jest.mock('@azure/service-bus');

const getMockedReceiver = (
  mock: jest.Mock<any, any, any>,
): ServiceBusReceiver => ({
  subscribe: mock,
  abandonMessage: jest.fn(),
  close: jest.fn(),
  completeMessage: jest.fn(),
  identifier: '',
  deadLetterMessage: jest.fn(),
  deferMessage: jest.fn(),
  entityPath: '',
  getMessageIterator: jest.fn(),
  isClosed: false,
  peekMessages: jest.fn(),
  receiveDeferredMessages: jest.fn(),
  receiveMessages: jest.fn(),
  receiveMode: 'peekLock',
  renewMessageLock: jest.fn(),
});

describe('GIVEN AzureServiceBusClient', () => {
  let azureServiceBus: AzureServiceBusClient;
  const connectionString = 'connection-string';
  beforeEach(() => {
    azureServiceBus = new AzureServiceBusClient({
      connectionString: 'connection-string',
    });
  });

  test('WHEN initializes THEN a service bus instance should be defined', () => {
    expect(ServiceBusClient).toHaveBeenCalledWith(connectionString);
  });

  test('WHEN register a queue THEN a sender should be created with the same name', async () => {
    const createMock = jest.fn();
    jest
      .spyOn(ServiceBusClient.prototype, 'createSender')
      .mockImplementation((queue: string) => createMock(queue));
    await azureServiceBus.register('test');
    expect(createMock).toHaveBeenCalledWith('test');
  });

  test('WHEN register a queue THEN a sender should be created with the same name', async () => {
    const createMock = jest.fn();
    jest
      .spyOn(ServiceBusClient.prototype, 'createReceiver')
      .mockImplementation((queue: string) => getMockedReceiver(createMock));

    azureServiceBus.subscribe({ name: 'test' }, createMock);
    expect(createMock).toHaveBeenCalled();
  });

  test('WHEN close is called THEN should call close on senders and receivers', async () => {
    const createMock = jest.fn();
    jest
      .spyOn(ServiceBusClient.prototype, 'createReceiver')
      .mockImplementation((queue: string) => getMockedReceiver(createMock));
    jest.spyOn(ServiceBusClient.prototype, 'close');

    azureServiceBus.subscribe({ name: 'test' }, createMock);
    azureServiceBus.register('test');
    await azureServiceBus.close();
    expect(ServiceBusClient.prototype.close).toHaveBeenCalled();
  });

  test('WHEN emit a message THEN should call sendMessages on Servicebus sender instance', async () => {
    const sendMessagesMock = jest.fn();
    const sendScheduledMessages = jest.fn();
    const subscribeMock = jest.fn();
    const mockedSender = jest
      .spyOn(ServiceBusClient.prototype, 'createSender')
      .mockImplementation(() => ({
        identifier: '',
        entityPath: '',
        isClosed: false,
        sendMessages: sendMessagesMock,
        createMessageBatch: jest.fn(),
        cancelScheduledMessages: jest.fn(),
        close: jest.fn(),
        scheduleMessages: sendScheduledMessages,
      }));
    const mockedReceiver = jest
      .spyOn(ServiceBusClient.prototype, 'createReceiver')
      .mockReturnValue(getMockedReceiver(subscribeMock));
    jest.spyOn(ServiceBusClient.prototype, 'close');

    azureServiceBus.register('test');
    azureServiceBus.subscribe({ name: 'test' }, subscribeMock);
    const emittable = await azureServiceBus.emit('test');
    emittable({ payload: { body: { test: 'test' } } });
    expect(sendMessagesMock).toHaveBeenCalledTimes(1);
    expect(sendScheduledMessages).toHaveBeenCalledTimes(0);
    expect(mockedReceiver).toHaveBeenCalled();
  });

  test('WHEN emit a message with update time THEN should call sendScheduleMessages on Servicebus sender instance', async () => {
    const sendMessagesMock = jest.fn();
    const sendScheduledMessages = jest.fn();
    const mockedSender = jest
      .spyOn(ServiceBusClient.prototype, 'createSender')
      .mockImplementation(() => ({
        identifier: '',
        entityPath: '',
        isClosed: false,
        sendMessages: sendMessagesMock,
        createMessageBatch: jest.fn(),
        cancelScheduledMessages: jest.fn(),
        close: jest.fn(),
        scheduleMessages: sendScheduledMessages,
      }));
    jest.spyOn(ServiceBusClient.prototype, 'close');
    azureServiceBus.register('test');
    const emittable = await azureServiceBus.emit('test');
    emittable({ payload: { body: { test: 'test' } }, updateTime: new Date() });
    expect(sendMessagesMock).toHaveBeenCalledTimes(0);
    expect(sendScheduledMessages).toHaveBeenCalledTimes(1);
  });

  test('WHEN emit a message with update time THEN should call sendScheduleMessages on Servicebus sender instance', async () => {
    const sendMessagesMock = jest.fn();
    const sendScheduledMessages = jest.fn();
    const mockedSender = jest
      .spyOn(ServiceBusClient.prototype, 'createSender')
      .mockImplementation(() => ({
        identifier: '',
        entityPath: '',
        isClosed: false,
        sendMessages: sendMessagesMock,
        createMessageBatch: jest.fn(),
        cancelScheduledMessages: jest.fn(),
        close: jest.fn(),
        scheduleMessages: sendScheduledMessages,
      }));
    jest.spyOn(ServiceBusClient.prototype, 'close');

    azureServiceBus.register('test');
    const emittable = await azureServiceBus.emit('test');
    expect(
      emittable({
        payload: { body: { test: 'test' } },
        updateTime: 'dans' as unknown as Date,
      }),
    ).rejects.toThrow();

    expect(sendMessagesMock).toHaveBeenCalledTimes(0);
    expect(sendScheduledMessages).toHaveBeenCalledTimes(0);
  });
});
