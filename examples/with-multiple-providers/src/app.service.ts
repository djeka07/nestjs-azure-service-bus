import { Subscribe } from '@djeka07/nestjs-azure-service-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Subscribe({ name: 'test', subscription: 'test', provider: 'provider_1' })
  onMessage(data) {
    console.log('message one', data);
  }

  @Subscribe({ name: 'test', subscription: 'test', provider: 'provider_2' })
  onMessageTwo(data) {
    console.log('message two', data);
  }
}
