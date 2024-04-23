import { ServiceBusClient } from '@azure/service-bus';
import { AzureServiceBusModule } from './azure-service-bus.module';
import { Test } from '@nestjs/testing';
import { AzureServiceBusClient } from '../clients';
import { AZURE_SERVICE_BUS_SENDER } from '../constants';
import { Emit } from '../interfaces';
import { ExplorerService } from '../services/explorer.service';
import { MetadataScanner } from '@nestjs/core';

jest.mock('@azure/service-bus');

describe('GIVEN AzureServiceBusModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('WHEN forRootAsync THEN module should be defined and onModuleInit to have been called', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AzureServiceBusModule.forRootAsync({
          useFactory: () => ({
            connectionString: 'fake-connection-string',
          }),
        }),
      ],
    }).compile();

    const module = moduleRef.get<AzureServiceBusModule>(AzureServiceBusModule);
    module.onModuleInit = jest.fn();
    await moduleRef.init();
    const client = moduleRef.get<AzureServiceBusClient>(AzureServiceBusClient);
    expect(client).toBeInstanceOf(AzureServiceBusClient);
    expect(module).toBeDefined();
    expect(ServiceBusClient).toHaveBeenCalledWith('fake-connection-string');
    expect(module.onModuleInit).toHaveBeenCalled();
  });

  it('WHEN forRoot THEN module should be defined and onModuleInit to have been called', async () => {
    const options = {
      connectionString: 'connection-string',
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AzureServiceBusModule.forRoot(options)],
    }).compile();

    const module = moduleRef.get<AzureServiceBusModule>(AzureServiceBusModule);
    module.onModuleInit = jest.fn();
    await moduleRef.init();

    const client = moduleRef.get<AzureServiceBusClient>(AzureServiceBusClient);
    expect(client).toBeInstanceOf(AzureServiceBusClient);
    expect(module).toBeDefined();
    expect(ServiceBusClient).toHaveBeenCalledWith(options.connectionString);
    expect(module.onModuleInit).toHaveBeenCalled();
  });

  test('WHEN onModuleInit THEN subscribe should be called', async () => {
    const options = {
      connectionString: 'connection-string',
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AzureServiceBusModule.forRoot(options)],
    }).compile();

    jest
      .spyOn(AzureServiceBusClient.prototype, 'subscribe')
      .mockImplementation(jest.fn());
    const client = moduleRef.get<AzureServiceBusClient>(AzureServiceBusClient);

    jest
      .spyOn(ExplorerService.prototype, 'getAzureServiceBusClientProviders')
      .mockImplementation(() =>
        Promise.resolve([
          {
            name: AzureServiceBusClient.name,
            dependencyType: null,
            instance: client,
            parentModule: null,
          },
        ]),
      );
    jest
      .spyOn(ExplorerService.prototype, 'getMethodsWithSubscriberKey')
      .mockResolvedValue([
        {
          discoveredMethod: {
            handler: jest.fn(),
            methodName: 'testMethod',
            parentClass: {
              instance: {},
              dependencyType: null,
              name: '',
              parentModule: {
                dependencyType: null,
                name: 'parent',
                instance: {},
              },
            },
          },
          meta: { receiver: { name: 'test' } },
        },
      ]);
    await moduleRef.init();
    expect(AzureServiceBusClient.prototype.subscribe).toHaveBeenCalled();
  });

  test('WHEN there is no AzureServiceBusClient register THEN should throw error', async () => {
    const options = {
      connectionString: 'connection-string',
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AzureServiceBusModule.forRoot(options)],
    }).compile();

    jest
      .spyOn(ExplorerService.prototype, 'getAzureServiceBusClientProviders')
      .mockImplementation(() => Promise.resolve([]));
    jest
      .spyOn(ExplorerService.prototype, 'getMethodsWithSubscriberKey')
      .mockResolvedValue([
        {
          discoveredMethod: {
            handler: jest.fn(),
            methodName: 'testMethod',
            parentClass: {
              instance: {},
              dependencyType: null,
              name: '',
              parentModule: {
                dependencyType: null,
                name: 'parent',
                instance: {},
              },
            },
          },
          meta: { receiver: { name: 'test' } },
        },
      ]);
    expect(moduleRef.init()).rejects.toThrow(
      `Could not find any registered servicebus client with name ${AzureServiceBusClient.name}`,
    );
    expect(AzureServiceBusClient.prototype.subscribe).toHaveBeenCalledTimes(0);
  });

  test('WHEN forRootAsync THEN should ServiceBusClient should have correct connection string', async () => {
    const options = {
      connectionString: 'connection-string',
    };
    const optionsFactory = jest.fn().mockResolvedValue(options);

    const moduleRef = await Test.createTestingModule({
      imports: [
        AzureServiceBusModule.forRootAsync({ useFactory: optionsFactory }),
      ],
    }).compile();

    const client = moduleRef.get<AzureServiceBusClient>(AzureServiceBusClient);
    expect(client).toBeInstanceOf(AzureServiceBusClient);
    expect(optionsFactory).toHaveBeenCalled();
    expect(ServiceBusClient).toHaveBeenCalledWith(options.connectionString);
  });

  test('WHEN forFeature THEN a sender with that feature should be setted up', async () => {
    jest.spyOn(AzureServiceBusClient.prototype, 'register');

    const moduleRef = await Test.createTestingModule({
      imports: [
        AzureServiceBusModule.forRootAsync({
          useFactory: () => ({
            connectionString: 'fake-connection-string',
          }),
        }),
        AzureServiceBusModule.forFeature([{ name: 'test' }, { name: 'test2' }]),
      ],
    }).compile();

    const client = moduleRef.get<AzureServiceBusClient>(AzureServiceBusClient);
    expect(client.register).toHaveBeenCalledWith('test');
    expect(client.register).toHaveBeenCalledWith('test2');
    const testSender = moduleRef.get(`${AZURE_SERVICE_BUS_SENDER}TEST`) as Emit;
    expect(testSender).toBeDefined();
  });

  test('WHEN forFeature and a sender emits THEN emit should be called', async () => {
    jest.spyOn(AzureServiceBusClient.prototype, 'register');
    jest.spyOn(AzureServiceBusClient.prototype, 'emit');
    const moduleRef = await Test.createTestingModule({
      imports: [
        AzureServiceBusModule.forRootAsync({
          useFactory: () => ({
            connectionString: 'fake-connection-string',
          }),
        }),
        AzureServiceBusModule.forFeature([{ name: 'test' }]),
      ],
    }).compile();

    const payload = { payload: { body: { test: 'test' } } };
    const client = moduleRef.get<AzureServiceBusClient>(AzureServiceBusClient);
    const testSender = moduleRef.get(`${AZURE_SERVICE_BUS_SENDER}TEST`) as Emit;
    await testSender(payload);
    expect(client.emit).toHaveBeenCalledWith('test');
  });
});
