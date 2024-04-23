import { Test } from '@nestjs/testing';
import { ExplorerService } from './explorer.service';

describe('GIVEN ExplorerService', () => {
  let explorerService: ExplorerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [ExplorerService],
    }).compile();

    explorerService = module.get(ExplorerService);
  });
});
