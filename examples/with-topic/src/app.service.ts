import { Injectable } from '@nestjs/common';
import { AzureServiceBusMessage, Subscribe } from '../dist';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Subscribe({ name: 'message_created', subscription: 'notification-service' })
  sub(data: AzureServiceBusMessage<{ hej: string }>): void {
    console.log('data', data);
  }
}
