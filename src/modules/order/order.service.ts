import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus, PaymentMethod } from './domain/order.entity';
import {
  OrderItemEntity,
  OrderItemStatus,
} from '@modules/order-items/domain/orderItem.entity';
import { CreateOrderDto } from './dto';
import { generateRandomCode } from '@shared/util/random';
// import { CreateOrderItemDto } from '@modules/order-items/dto/create.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async create(orderData: Partial<CreateOrderDto>): Promise<OrderEntity> {
    const order = await this.orderRepository.save(orderData);
    console.log(orderData.orderItems.length);

    if (orderData.orderItems.length) {
      for (const item of orderData.orderItems) {
        console.log(item);

        // Perform the update operation directly
        await this.orderItemRepository
          .createQueryBuilder()
          .update(OrderItemEntity)
          .set({ status: item.status })
          .where('id = :id', { id: item.id })
          .execute();
      }
    }
    return order;
  }

  async findAll(userId: string): Promise<OrderEntity[]> {
    const orderItem = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .where('order.userId = :userId', { userId })
      .getMany();
    if (!orderItem)
      throw new HttpException('OrderItem not found', HttpStatus.NOT_FOUND);
    return orderItem;
  }

  async findOne(id: string, userId: string): Promise<OrderEntity | null> {
    const orderItem = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .where('order.id = :id AND orderItem.status = :status ', {
        id,
        status: OrderItemStatus.ORDERING,
      })
      .andWhere('order.userId = :userId', { userId })
      .getOne();
    if (!orderItem)
      throw new HttpException('OrderItem not found', HttpStatus.NOT_FOUND);
    return orderItem;
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<CreateOrderDto>,
  ): Promise<any> {
    const updateOrder = await this.orderRepository
      .createQueryBuilder()
      .update(OrderEntity)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    if (updateOrder)
      return {
        message: `Order ${id} updated successfully`,
        status: HttpStatus.ACCEPTED,
      };
    throw new HttpException(`Order ${id} not found`, HttpStatus.NOT_FOUND);
  }

  async checkout(paymentMethod, id, userId) {
    const order = await this.findOne(id, userId);
    const orderCode = await generateRandomCode(10, true);
    if (paymentMethod === PaymentMethod.CASH) {
      order.status = OrderStatus.IN_PROGRESS;
      order.orderCode = orderCode;
    }
  }

  async delete(id: string, userId: string): Promise<any> {
    const order = await this.findOne(id, userId);
    if (order) {
      const deleteOrder = await this.orderRepository.remove(order);
      if (deleteOrder[0])
        return {
          message: `Order ${id} deleted successfully`,
          status: HttpStatus.ACCEPTED,
        };
      throw new HttpException(`Order ${id} not found`, HttpStatus.NOT_FOUND);
    }
  }
}
