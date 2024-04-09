import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '@djeka07/nestjs-azure-service-bus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('provider_1')
    private readonly azureServiceBusClient: AzureServiceBusClient,
    @Inject('provider_2')
    private readonly azureServiceBusSecondService: AzureServiceBusClient,
  ) {}

  @Get()
  getHello(): string {
    this.azureServiceBusClient.emit({
      payload: { body: { test: 'test' } },
      name: 'test',
    });
    return this.appService.getHello();
  }

  @Get('/second')
  getSecondHello(): string {
    this.azureServiceBusSecondService.emit({
      payload: { body: { test: 'second test' } },
      name: 'test',
    });
    return this.appService.getHello();
  }
}
