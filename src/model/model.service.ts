import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './model.entity';
import { Brand } from '../brand/brand.entity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelsRepository: Repository<Model>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async createModel(brandId: number, modelName: string): Promise<Model> {
    const brand = await this.brandsRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const newModel = this.modelsRepository.create({
      modelName,
      brand,
    });
    return this.modelsRepository.save(newModel);
  }

  async updateModel(modelId: number, modelName: string): Promise<Model> {
    const model = await this.modelsRepository.findOne({
      where: { id: modelId },
    });
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    model.modelName = modelName;
    return this.modelsRepository.save(model);
  }
}
