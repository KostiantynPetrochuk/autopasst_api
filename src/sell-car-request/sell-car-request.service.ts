import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellCarRequest } from './sell-car-request.entity';
import { SellCarRequestFilterDto } from './dto/sell-car-request-filter.dto';

@Injectable()
export class SellCarRequestService {
  constructor(
    @InjectRepository(SellCarRequest)
    private sellCarRequestRepository: Repository<SellCarRequest>,
  ) {}

  async save(data: Partial<SellCarRequest>): Promise<number> {
    const newRequest = this.sellCarRequestRepository.create(data);
    const saved = await this.sellCarRequestRepository.save(newRequest);
    return saved.id;
  }

  async getSellCarRequests(
    filter: SellCarRequestFilterDto,
  ): Promise<{ data: SellCarRequest[]; total: number }> {
    const qb = this.sellCarRequestRepository.createQueryBuilder('scr');

    if (filter.status) {
      qb.andWhere('scr.status = :status', { status: filter.status });
    }

    if (filter.countryOfExploitation) {
      qb.andWhere('scr.countryOfExploitation ILIKE :country', {
        country: `%${filter.countryOfExploitation}%`,
      });
    }

    if (filter.createdAt) {
      const kyivTime = new Date(
        filter.createdAt.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }),
      );
      const startOfDay = new Date(kyivTime.setHours(0, 0, 0, 0));
      const endOfDay = new Date(kyivTime.setHours(23, 59, 59, 999));
      qb.andWhere('scr.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });
    }

    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 20;

    qb.skip(offset).take(limit);
    qb.orderBy('scr.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async getSellCarRequestById(id: number): Promise<SellCarRequest> {
    const request = await this.sellCarRequestRepository.findOneBy({ id });
    if (!request) {
      throw new NotFoundException(`SellCarRequest with id ${id} not found`);
    }
    return request;
  }

  async editSellCarRequest(
    data: Partial<SellCarRequest>,
  ): Promise<SellCarRequest> {
    if (!data.id) {
      throw new Error('ID is required to update SellCarRequest');
    }
    await this.sellCarRequestRepository.update(data.id, data);
    const updated = await this.sellCarRequestRepository.findOneBy({
      id: data.id,
    });
    if (!updated) {
      throw new NotFoundException(
        `SellCarRequest with id ${data.id} not found after update`,
      );
    }
    return updated;
  }
}
