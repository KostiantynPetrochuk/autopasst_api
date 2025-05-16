import { Test, TestingModule } from '@nestjs/testing';
import { CarSelectionController } from './car-selection.controller';

describe('CarSelectionController', () => {
  let controller: CarSelectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarSelectionController],
    }).compile();

    controller = module.get<CarSelectionController>(CarSelectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
