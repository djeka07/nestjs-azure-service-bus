import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AzureServiceBusModule } from '../../../src/modules/azure-service-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    AzureServiceBusModule.forAsyncRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          connectionString: configService.get(
            'AZURE_SERVICE_BUS_CONNECTION_STRING',
          ),
          senders: [{ name: 'message_created' }],
          receivers: [
            {
              name: 'message_created',
              subscription: 'notification-service',
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
