import {
  AzureServiceBusMessage,
  Subscribe,
} from '@djeka07/nestjs-azure-service-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Subscribe({ name: 'test3', subscription: 'test3' })
  onMessage(data: AzureServiceBusMessage<{ test: string }>): void {
    console.log('test2', data);
  }
  @Subscribe({ name: 'test', subscription: 'test' })
  onMessageTwo(data: AzureServiceBusMessage<{ test: string }>): void {
    console.log('test', data);
  }
}
