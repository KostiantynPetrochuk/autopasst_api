import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarSelectionController } from './car-selection.controller';
import { CarSelection } from './car-selection.entity';
import { CarSelectionService } from './car-selection.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarSelection])],
  providers: [CarSelectionService],
  controllers: [CarSelectionController],
  exports: [CarSelectionService],
})
export class CarSelectionModule {}
