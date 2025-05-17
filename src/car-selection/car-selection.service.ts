import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarSelection } from './car-selection.entity';
import { CarSelectionFilterDto } from './dto/car-selection-filter.dto';

@Injectable()
export class CarSelectionService {
  constructor(
    @InjectRepository(CarSelection)
    private carSelectionRepository: Repository<CarSelection>,
  ) {}

  async save(carSelection: Partial<CarSelection>): Promise<number> {
    const newSelection = this.carSelectionRepository.create(carSelection);
    const saved = await this.carSelectionRepository.save(newSelection);
    return saved.id;
  }

  async getCarSelections(
    filter: CarSelectionFilterDto,
  ): Promise<{ data: CarSelection[]; total: number }> {
    const qb = this.carSelectionRepository.createQueryBuilder('car_selection');
    if (filter.status) {
      qb.andWhere('car_selection.status = :status', { status: filter.status });
    }
    if (filter.countryOfExploitation) {
      qb.andWhere('car_selection.countryOfExploitation ILIKE :country', {
        country: `%${filter.countryOfExploitation}%`,
      });
    }
    if (filter.createdAt) {
      const kyivTime = new Date(
        filter.createdAt.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }),
      );
      const startOfDay = new Date(kyivTime.setHours(0, 0, 0, 0));
      const endOfDay = new Date(kyivTime.setHours(23, 59, 59, 999));
      qb.andWhere('car_selection.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });
    }
    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 20;
    qb.skip(offset).take(limit);
    qb.orderBy('car_selection.createdAt', 'DESC');
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async getCarSelectionById(id: number): Promise<CarSelection> {
    const carSelection = await this.carSelectionRepository.findOneBy({ id });
    if (!carSelection) {
      throw new NotFoundException(`CarSelection with id ${id} not found`);
    }
    return carSelection;
  }

  async editCarSelection(
    carSelection: Partial<CarSelection>,
  ): Promise<CarSelection> {
    if (!carSelection.id) {
      throw new Error('ID is required to update CarSelection');
    }
    await this.carSelectionRepository.update(carSelection.id, carSelection);
    const updated = await this.carSelectionRepository.findOneBy({
      id: carSelection.id,
    });
    if (!updated) {
      throw new NotFoundException(
        `CarSelection with id ${carSelection.id} not found after update`,
      );
    }
    return updated;
  }
}
