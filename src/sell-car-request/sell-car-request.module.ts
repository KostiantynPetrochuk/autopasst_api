import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellCarRequestController } from './sell-car-request.controller';
import { SellCarRequestService } from './sell-car-request.service';
import { SellCarRequest } from './sell-car-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellCarRequest])],
  controllers: [SellCarRequestController],
  providers: [SellCarRequestService],
  exports: [SellCarRequestService],
})
export class SellCarRequestModule {}
