import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '@djeka07/nestjs-azure-service-bus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly azureServiceBusClient: AzureServiceBusClient,
  ) {}

  @Get()
  getHello(): string {
    this.azureServiceBusClient.emit({
      name: 'test2',
      payload: { body: { test: 'test' } },
    });
    return this.appService.getHello();
  }
}
