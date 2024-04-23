import { Test } from '@nestjs/testing';
import { ExplorerService } from './explorer.service';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

describe('GIVEN ExplorerService', () => {
  let explorerService: ExplorerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [ExplorerService, MetadataScanner],
    }).compile();

    explorerService = module.get(ExplorerService);
  });

  test('WHEN ', () => {
    expect(true).toBe(true);
  });
});
