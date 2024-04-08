import { Injectable } from '@nestjs/common';
import { Subscribe } from '../../../src/decorators/subscribe.decorator';
import { AzureServiceBusMessage } from '../../../src/interfaces';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Subscribe({ name: 'test' })
  onMessage(data: AzureServiceBusMessage<{ test: string }>) {
    console.log(data.body?.test);
  }
}
