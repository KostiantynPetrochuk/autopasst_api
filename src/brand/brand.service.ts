import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async createBrand(brandName: string, fileName: string): Promise<Brand> {
    const newBrand = this.brandsRepository.create({
      brandName,
      fileName,
    });
    return await this.brandsRepository.save(newBrand);
  }

  async getBrands() {
    return await this.brandsRepository.find({ relations: ['models'] });
  }
}
