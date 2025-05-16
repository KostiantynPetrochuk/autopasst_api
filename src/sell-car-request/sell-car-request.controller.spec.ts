import { Test, TestingModule } from '@nestjs/testing';
import { SellCarRequestController } from './sell-car-request.controller';

describe('SellCarRequestController', () => {
  let controller: SellCarRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellCarRequestController],
    }).compile();

    controller = module.get<SellCarRequestController>(SellCarRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
