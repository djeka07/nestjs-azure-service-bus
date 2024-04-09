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

  @Subscribe({ name: 'test', subscription: 'test' })
  sub(data: AzureServiceBusMessage<{ test: string }>): void {
    console.log('data', data);
  }
}
