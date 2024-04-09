<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">NestJS Azure service bus</h3>

<div align="center">
<a href="https://www.npmjs.com/package/@djeka07/nestjs-azure-service-bus"><img src="https://img.shields.io/npm/v/@djeka07/nestjs-azure-service-bus.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@djeka07/nestjs-azure-service-bus"><img src="https://img.shields.io/npm/l/@djeka07/nestjs-azure-service-bus.svg" alt="Package License" /></a>

  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Introduction

NestJS Azure service bus based on @azure/service-bus package. See [Examples](./examples) folder for usage,

### Installation

```bash
yarn add @djeka07/nestjs-azure-service-bus
```

### Usage

#### Importing module with only one provider

```typescript
import { AzureServiceBusModule } from '@djeka07/nestjs-azure-service-bus';

@Module({
  imports: [
    AzureServiceBusModule.forAsyncRoot({
      useFactory: async () => {
        return {
          connectionString: '<your-connection-string>'
          senders: [ // Senders to send messages. Optional if for example if only will recieve messages
              {
                name: '<queue/topic-name>',
                identifier: 'The identifier of the sender' // Optional
              }
            ],
          receivers: [ // Recievers to recieve messages, Optional if only will send messages
              {
                name: '<queue/topic-name>',
                subscription: '<subscription-name>' // Optional, required when using topics
              }
            ],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AModule {}
```

#### Importing module with multiple providers

```typescript
import { AzureServiceBusModule } from '@djeka07/nestjs-azure-service-bus';

@Module({
  imports: [
    AzureServiceBusModule.forAsyncRoot([
      {
        useFactory: async () => {
                return {
                  name: '<provider name>', // When using multiple providers a name need to be set
                  connectionString: '<your-connection-string>'
                  senders: [ // Senders to send messages. Optional if for example if only will recieve messages
                      {
                        name: '<queue/topic-name>',
                        identifier: 'The identifier of the sender' // Optional
                      }
                    ],
                  receivers: [ // Recievers to recieve messages, Optional if only will send messages
                      {
                        name: '<queue/topic-name>',
                        subscription: '<subscription-name>' // Optional, required when using topics
                      }
                    ],
                };
          },
      },
      {
        useFactory: async () => {
          return {
            name: '<provider name>', // When using multiple providers a name need to be set
            connectionString: 'connection string'
            senders: [ // Senders to send messages. Optional if for example if only will recieve messages
                {
                  name: '<queue/topic-name>',
                  identifier: 'The identifier of the sender' // Optional
                }
              ],
            receivers: [ // Recievers to recieve messages, Optional if only will send messages
                {
                  name: '<queue/topic-name>',
                  subscription: '<subscription-name>' // Optional, required when using topics
                }
              ],
          };
        },
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AModule {}
```

#### Emitting messages with one provider

```typescript
import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '@djeka07/nestjs-azure-service-bus';

@Controller()
export class AppController {
  constructor(
    public readonly azureServiceBusClient: AzureServiceBusClient,
    public readonly appService: AppService,
  ) {}

  @Post()
  post(): void {
    this.azureServiceBusClient.emit({
      payload: { body: { test: 'test' } },
      name: '<queue/topic name>',
    });
  }
}
```

#### Emitting messages with multiple providers

```typescript
import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureServiceBusClient } from '@djeka07/nestjs-azure-service-bus';

@Controller()
export class AppController {
  constructor(
    @Inject('<provider name>')
    private readonly azureServiceBusClient: AzureServiceBusClient,
    @Inject('provider name')
    private readonly azureServiceBusSecondService: AzureServiceBusClient,
  ) {}

  @Post()
  post(): void {
    this.azureServiceBusClient.emit({
      payload: { body: { test: 'test' } },
      name: '<queue/topic name>',
    });
  }

  @Post('/second')
  post(): void {
    this.azureServiceBusSecondService.emit({
      payload: { body: { test: 'second test' } },
      name: '<queue/topic name>',
    });
  }
}
```

#### Reveive messages

```typescript
import { Subscribe } from '@djeka07/nestjs-azure-service-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  @Subscribe({ name: '<queue-name>' })
  onMessage(data) {
    console.log('message one', data);
  }

  @Subscribe({ name: '<topic-name>', subscription: '<subscription-name>' })
  onMessageTwo(data) {
    console.log('message two', data);
  }
}

```

#### Reveive messages with multiple providers
```typescript
import { Subscribe } from '@djeka07/nestjs-azure-service-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  @Subscribe({ name: '<queue-name>', provider: '<provider-name>' })
  onMessage(data) {
    console.log('message one', data);
  }

  @Subscribe({ name: '<topic-name>', subscription: '<subscription-name>', provider: '<provider-name>' })
  onMessageTwo(data) {
    console.log('message two', data);
  }
}

```

## Author

**André Ekbom [Github](https://github.com/djeka07)**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
