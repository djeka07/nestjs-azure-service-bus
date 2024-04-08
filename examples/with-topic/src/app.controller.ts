import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '../dist';

@Controller()
export class AppController {
  constructor(
    public readonly azureServiceBusClient: AzureServiceBusClient,
    public readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    this.azureServiceBusClient.emit({
      payload: { body: { hej: 'dansa' }, replyTo: 'eka' },
      name: 'message_created',
    });
    return this.appService.getHello();
  }
}
