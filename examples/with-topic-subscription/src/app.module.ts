import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AzureServiceBusModule } from '@djeka07/nestjs-azure-service-bus';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AzureServiceBusModule.forAsyncRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          connectionString: configService.get(
            'AZURE_SERVICE_BUS_CONNECTION_STRING',
          ),
          senders: [{ name: 'test' }],
          receivers: [
            {
              name: 'test',
              subscription: 'test',
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
