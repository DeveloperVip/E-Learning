import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './domain/orderItem.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  // async create(
  //   orderItemData: Partial<CreateOrderItemDto>,
  // ): Promise<OrderItemEntity> {
  //   const orderItem = this.orderItemRepository.create(orderItemData);
  //   return await this.orderItemRepository.save(orderItem);
  // }

  async findAll(): Promise<OrderItemEntity[]> {
    const order = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('orderItem.order', 'order')
      .getMany();
    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    return order;
  }

  async findOne(id: string): Promise<OrderItemEntity | null> {
    const order = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('orderItem.order', 'order')
      .where('orderItem.id = :id', { id })
      .getOne();
    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    return order;
  }

  async update(id: string, updateData: Partial<OrderItemEntity>): Promise<any> {
    const updateOrder = await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItemEntity)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    if (updateOrder)
      return {
        message: `Order item ${id} update successfully`,
        status: HttpStatus.ACCEPTED,
      };
    throw new HttpException(`Order item ${id} not found`, HttpStatus.NOT_FOUND);
  }

  async delete(id: string): Promise<any> {
    const orderItem = await this.findOne(id);
    if (orderItem) {
      const deleteOrder = await this.orderItemRepository.remove(orderItem);
      if (deleteOrder[0])
        return {
          message: `Order ${id} deleted successfully`,
          status: HttpStatus.ACCEPTED,
        };
      throw new HttpException(`Order ${id} not found`, HttpStatus.NOT_FOUND);
    }
  }
}
