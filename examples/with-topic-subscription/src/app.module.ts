import { AzureServiceBusModule } from '@djeka07/nestjs-azure-service-bus';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MetadataScanner } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AzureServiceBusModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          connectionString: configService.get(
            'AZURE_SERVICE_BUS_CONNECTION_STRING',
          ),
        };
      },
      inject: [ConfigService],
    }),
    AzureServiceBusModule.forFeature([{ name: 'test' }, { name: 'test3' }]),
  ],

  controllers: [AppController],
  providers: [AppService, MetadataScanner],
})
export class AppModule {}
