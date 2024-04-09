import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '@djeka07/nestjs-azure-service-bus';

@Controller()
export class AppController {
  constructor(
    public readonly azureServiceBusClient: AzureServiceBusClient,
    public readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    this.azureServiceBusClient.emit({
      payload: { body: { test: 'test' } },
      name: 'test',
      updateTime: new Date(),
    });
    return this.appService.getHello();
  }
}
