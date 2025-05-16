import { Module } from '@nestjs/common';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { Model } from './model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../brand/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model, Brand])],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
