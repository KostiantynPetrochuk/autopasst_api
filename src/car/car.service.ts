import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { CreateCarDto } from './dto/createCar.dto';
import { Brand } from '../brand/brand.entity';
import { Model } from '../model/model.entity';
import { CarFilterDto } from './dto/car-filter.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
  ) {}

  async createCar(carDto: CreateCarDto): Promise<Car> {
    const brand = await this.brandRepository.findOne({
      where: { id: carDto.brandId },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with id ${carDto.brandId} not found`);
    }
    const model = await this.modelRepository.findOne({
      where: { id: carDto.modelId },
    });
    if (!model) {
      throw new NotFoundException(`Model with id ${carDto.modelId} not found`);
    }
    const car = this.carRepository.create({
      ...carDto,
      brand,
      model,
    });
    return await this.carRepository.save(car);
  }

  async getCarById(id: number): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['brand', 'model', 'carFeatures', 'carFeatures.feature'],
    });
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  async getFilteredCars(
    filter: CarFilterDto,
  ): Promise<{ data: Car[]; total: number }> {
    const qb = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model');

    if (filter.status) {
      qb.andWhere('car.status IN (:...status)', {
        status: filter.status.split(','),
      });
    }

    if (filter.condition) {
      qb.andWhere('car.condition IN (:...condition)', {
        condition: filter.condition.split(','),
      });
    }

    if (filter.brand) {
      qb.andWhere('car.brandId = :brandId', { brandId: filter.brand });
    }

    if (filter.model) {
      const modelIds = filter.model.split(',').map(Number);
      qb.andWhere('car.modelId IN (:...modelIds)', { modelIds });
    }

    if (filter.bodyType) {
      qb.andWhere('car.bodyType IN (:...bodyTypes)', {
        bodyTypes: filter.bodyType.split(','),
      });
    }

    if (filter.fuelType) {
      qb.andWhere('car.fuelType IN (:...fuelTypes)', {
        fuelTypes: filter.fuelType.split(','),
      });
    }

    if (filter.transmission) {
      qb.andWhere('car.transmission IN (:...transmissions)', {
        transmissions: filter.transmission.split(','),
      });
    }

    if (filter.mileageFrom) {
      qb.andWhere('car.mileage >= :mileageFrom', {
        mileageFrom: filter.mileageFrom,
      });
    }

    if (filter.mileageTo) {
      qb.andWhere('car.mileage <= :mileageTo', { mileageTo: filter.mileageTo });
    }

    if (filter.priceFrom) {
      qb.andWhere('car.price >= :priceFrom', { priceFrom: filter.priceFrom });
    }

    if (filter.priceTo) {
      qb.andWhere('car.price <= :priceTo', { priceTo: filter.priceTo });
    }

    if (filter.sortBy === 'price_low_to_high') {
      qb.orderBy('car.price', 'ASC');
    } else if (filter.sortBy === 'price_high_to_low') {
      qb.orderBy('car.price', 'DESC');
    } else {
      qb.orderBy('car.createdAt', 'DESC');
    }

    const offset = filter.offset || 0;
    const limit = filter.limit || 20;

    qb.skip(offset).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}
