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

  calculateShippingFee(distance: number, productWeight: number): number {
    let shippingFee = 0;

    // Giả sử phí ship cơ bản là 30k cho 10km đầu tiên
    if (distance <= 10) {
      shippingFee = 30000;
    } else {
      shippingFee = 30000 + (distance - 10) * 2000;
    }
    if (productWeight > 5) {
      shippingFee += 5000;
    }

    return shippingFee;
  }

  // Tính phí ship cho order item và cập nhật vào OrderItem
  async calculateAndUpdateShippingForOrderItem(
    id: string,
    distance: number,
    productWeight: number,
  ): Promise<OrderItemEntity> {
    try {
      const orderItem = await this.findOne(id);
      if (!orderItem) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      // Tính phí ship dựa trên distance và weight
      const shippingFee = this.calculateShippingFee(distance, productWeight);

      // Cập nhật phí ship vào OrderItem
      orderItem.shippingFee = shippingFee;
      await this.orderItemRepository.save(orderItem); // Lưu lại thay đổi

      return orderItem;
    } catch (error) {
      throw new HttpException(
        `Error calculating and updating shipping fee: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Tìm tất cả order items
  async findAll(): Promise<OrderItemEntity[]> {
    try {
      const order = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoinAndSelect('orderItem.product', 'product')
        .leftJoinAndSelect('orderItem.order', 'order')
        .getMany();

      if (!order) {
        throw new HttpException('Order items not found', HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (error) {
      throw new HttpException(
        `Error fetching order items: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Tìm một order item theo ID
  async findOne(id: string): Promise<OrderItemEntity | null> {
    try {
      const order = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoinAndSelect('orderItem.product', 'product')
        .leftJoinAndSelect('orderItem.order', 'order')
        .where('orderItem.id = :id', { id })
        .getOne();

      if (!order) {
        throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (error) {
      throw new HttpException(
        `Error fetching order item with ID ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Cập nhật order item
  async update(id: string, updateData: Partial<OrderItemEntity>): Promise<any> {
    try {
      const updateOrder = await this.orderItemRepository
        .createQueryBuilder()
        .update(OrderItemEntity)
        .set(updateData)
        .where('id = :id', { id })
        .execute();

      if (updateOrder.affected === 0) {
        throw new HttpException(
          `Order item ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: `Order item ${id} updated successfully`,
        status: HttpStatus.ACCEPTED,
      };
    } catch (error) {
      throw new HttpException(
        `Error updating order item: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Xóa order item
  async delete(id: string): Promise<any> {
    try {
      const orderItem = await this.findOne(id);

      if (orderItem) {
        const deleteOrder = await this.orderItemRepository.remove(orderItem);

        if (deleteOrder[0]) {
          return {
            message: `Order item ${id} deleted successfully`,
            status: HttpStatus.ACCEPTED,
          };
        }
      }

      throw new HttpException(
        `Order item ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      throw new HttpException(
        `Error deleting order item: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
