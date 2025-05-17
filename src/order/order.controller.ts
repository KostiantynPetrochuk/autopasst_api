import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderFilterDto } from './dto/order-filter.dto';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async addOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    orderData.status = 'new';
    const newOrder = await this.orderService.createOrder(orderData);
    return newOrder;
  }

  @Get()
  async getOrders(@Query() query: OrderFilterDto) {
    const { data, total } = await this.orderService.getOrders(query);
    return { orders: data, total };
  }

  @Get(':id')
  async getOrder(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return { order };
  }

  @Patch('status')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  async setOrderStatus(
    @Body()
    requestData: {
      id: number;
      status: string;
      cancelReason?: string;
    },
    @Req() req: Request,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User not found');
    }
    const canceledStatus = requestData.status === 'canceled';
    const cancelReasonEmpty =
      !requestData.cancelReason || requestData.cancelReason.length < 3;
    if (canceledStatus && cancelReasonEmpty) {
      throw new BadRequestException('Cancel reason is required.');
    }
    const updatePayload: UpdateOrderDto = {
      id: requestData.id,
      status: requestData.status,
      updatedAt: new Date(),
      lastStatusUpdatedById: userId,
      cancellationReason: requestData.cancelReason,
    };
    if (requestData.status === 'canceled') {
      updatePayload.cancellationReason = requestData.cancelReason;
    }
    const updatedOrder = await this.orderService.updateOrder(updatePayload);
    if (requestData.status === 'completed') {
      await this.orderService.markCarSold(updatedOrder.carId);
    }
    return { message: 'Order status edited successfully!' };
  }
}
