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
    @Emittable('test')
    public readonly emit: Emit,
    @Emittable('test3')
    public readonly test3Emit: Emit,
    public readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    this.emit({ payload: { body: { hej: 'test' } } });
    this.test3Emit({ payload: { body: { hej: 'test2' } } });
    return this.appService.getHello();
  }
}
