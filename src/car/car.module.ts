import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from './car.entity';
import { Brand } from 'src/brand/brand.entity';
import { Model } from 'src/model/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Brand, Model])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
