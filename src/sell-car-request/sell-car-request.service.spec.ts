import { Test, TestingModule } from '@nestjs/testing';
import { SellCarRequestService } from './sell-car-request.service';

describe('SellCarRequestService', () => {
  let service: SellCarRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellCarRequestService],
    }).compile();

    service = module.get<SellCarRequestService>(SellCarRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
