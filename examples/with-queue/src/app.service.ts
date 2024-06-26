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

  @Subscribe({ name: 'test2' })
  onMessage(data: AzureServiceBusMessage<{ test: string }>) {
    console.log(data);
  }
}
