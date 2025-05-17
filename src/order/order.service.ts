import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderFilterDto } from './dto/order-filter.dto';
import { Car } from '../car/car.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async createOrder(order: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepository.create(order);
    return await this.orderRepository.save(newOrder);
  }

  async getOrders(
    filter: OrderFilterDto,
  ): Promise<{ data: Order[]; total: number }> {
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.car', 'car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model');
    if (filter.status) {
      qb.andWhere('order.status = :status', { status: filter.status });
    }
    if (filter.countryOfExploitation) {
      qb.andWhere('order.countryOfExploitation ILIKE :country', {
        country: `%${filter.countryOfExploitation}%`,
      });
    }
    if (filter.createdAt) {
      const kyivTime = new Date(
        filter.createdAt.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }),
      );
      const start = new Date(kyivTime.setHours(0, 0, 0, 0));
      const end = new Date(kyivTime.setHours(23, 59, 59, 999));
      qb.andWhere('order.createdAt BETWEEN :start AND :end', { start, end });
    }
    const offset = filter.offset || 0;
    const limit = filter.limit || 20;
    qb.skip(offset).take(limit);
    qb.orderBy('order.createdAt', 'DESC');
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['car', 'car.brand', 'car.model'],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateOrder(data: UpdateOrderDto): Promise<Order> {
    if (!data.id) {
      throw new BadRequestException('Order ID is required for update.');
    }
    await this.orderRepository.update(data.id, data);
    const updated = await this.orderRepository.findOne({
      where: { id: data.id },
      relations: ['car', 'car.brand', 'car.model'],
    });
    if (!updated) {
      throw new NotFoundException(`Updated order with id ${data.id} not found`);
    }
    return updated;
  }

  async markCarSold(carId: number): Promise<void> {
    await this.carRepository.update(carId, { status: 'sold_out' });
  }
}
