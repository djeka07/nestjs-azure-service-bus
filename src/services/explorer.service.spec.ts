import { Test } from '@nestjs/testing';
import { ExplorerService } from './explorer.service';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from 'examples/with-queue/dist/app.controller';
import { Module } from '@nestjs/core/injector/module';
import { AppModule } from 'examples/with-queue/dist/app.module';
import { Injectable } from '@nestjs/common';
import { Subscribe } from '../decorators';

@Injectable()
class TestService {
  @Subscribe({ name: 'test' })
  log() {
    console.log('test');
  }
}

describe('GIVEN ExplorerService', () => {
  let explorerService: ExplorerService;
  let metadataScanner: MetadataScanner;
  let modulesContainer: ModulesContainer;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [ExplorerService, MetadataScanner, TestService],
    }).compile();

    explorerService = module.get(ExplorerService);
    metadataScanner = module.get(MetadataScanner);
    modulesContainer = module.get(ModulesContainer);
  });

  test('WHEN ', async () => {
    metadataScanner.getAllMethodNames = jest.fn().mockReturnValue(['']);
    jest.spyOn(Reflect, 'getMetadata').mockImplementation(jest.fn());
    const map = new Map<string, Module>();
    // map.set('test', new AppController());
    // modulesContainer.entries = jest.fn().mockReturnValue(map);
    console.log(await explorerService.getMethodsWithSubscriberKey());
  });
});
