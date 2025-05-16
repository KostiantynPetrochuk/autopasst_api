import { Test, TestingModule } from '@nestjs/testing';
import { CarSelectionService } from './car-selection.service';

describe('CarSelectionService', () => {
  let service: CarSelectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarSelectionService],
    }).compile();

    service = module.get<CarSelectionService>(CarSelectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
