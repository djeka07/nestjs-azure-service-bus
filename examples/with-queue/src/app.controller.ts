import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '../../../src/clients/azure-service-bus.client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly azureServiceBusClient: AzureServiceBusClient,
  ) {}

  @Get()
  getHello(): string {
    this.azureServiceBusClient.emit({
      name: 'test',
      payload: { body: { test: 'test' } },
    });
    return this.appService.getHello();
  }
}
