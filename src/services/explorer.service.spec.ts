import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/core/injector/module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { Test } from '@nestjs/testing';
import { Subscribe } from '../decorators';
import { ExplorerService } from './explorer.service';

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
