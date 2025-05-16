import { Module } from '@nestjs/common';
import { SellCarRequestController } from './sell-car-request.controller';
import { SellCarRequestService } from './sell-car-request.service';

@Module({
  controllers: [SellCarRequestController],
  providers: [SellCarRequestService]
})
export class SellCarRequestModule {}
