import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AzureServiceBusClient,
  Emit,
  Emittable,
} from '@djeka07/nestjs-azure-service-bus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Emittable('test2') private readonly emit: Emit,
  ) {}

  @Get()
  getHello(): string {
    this.emit({
      payload: { body: { test: 'test' } },
    });
    return this.appService.getHello();
  }
}
