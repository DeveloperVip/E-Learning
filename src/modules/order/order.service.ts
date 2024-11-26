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
import { QRcodeGenerate } from '@shared/util/QRcode';
import { statusResponse } from '@modules/users/status.enum';
// import { CreateOrderItemDto } from '@modules/order-items/dto/create.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  private VAT_PERCENTAGE = 10;

  async processOrderWithVAT(order: OrderEntity): Promise<any> {
    const vatAmount = (order.total * this.VAT_PERCENTAGE) / 100;
    const totalWithVAT = order.total + vatAmount;

    order.vat = this.VAT_PERCENTAGE;
    order.total = parseFloat(totalWithVAT.toFixed(2));
  }

  async create(orderData: Partial<CreateOrderDto>): Promise<any> {
    const order = new OrderEntity();
    order.address = orderData.address || null;
    order.phone = orderData.phone || null;
    order.promotion = orderData.promotion || 0;
    order.userId = orderData.userId;
    order.shippingFee = orderData.shippingFee || 0;

    // let total = 0;
    // if (orderData.orderItems && orderData.orderItems.length > 0) {
    //   for (const item of orderData.orderItems) {
    //     // Cập nhật trạng thái cho từng OrderItem
    //     await this.orderItemRepository
    //       .createQueryBuilder()
    //       .update(OrderItemEntity)
    //       .set({ status: item.status })
    //       .where('id = :id', { id: item.id })
    //       .execute();

    //     // Lấy giá của OrderItem từ DB
    //     const orderItem = await this.orderItemRepository.findOne({
    //       where: { id: item.id, expired: false, choosen: true },
    //       select: ['price', 'amount'],
    //     });

    //     if (orderItem) {
    //       // Tính giá trị từng OrderItem
    //       total += orderItem.price * orderItem.amount;
    //     }
    //   }
    // }
    // Tính VAT (10%)
    order.vat = 0;
    order.total = orderData.total;
    await order.save();
    order.total = order.total + order.shippingFee + order.vat - order.promotion;
    await order.save();
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
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'productvariant')
      .leftJoinAndSelect('productvariant.images', 'images')
      .leftJoinAndSelect('productvariant.product', 'product')
      .where(
        'order.id = :id AND orderItems.status = :status AND orderItems.choosen = :choosen',
        {
          id,
          status: OrderItemStatus.IN_CART,
          choosen: true,
        },
      )
      .andWhere('order.userId = :userId', { userId })
      .getOne();
    console.log(
      '🚀 ~ OrderService ~ findOne ~ orderItem:',
      orderItem,
      id,
      userId,
    );
    if (!orderItem)
      throw new HttpException('OrderItem not found', HttpStatus.NOT_FOUND);
    return orderItem;
  }

  async findOneOrderNotPaid(id: string): Promise<OrderEntity | any> {
    const orderItem = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'productvariant')
      .leftJoinAndSelect('productvariant.images', 'images')
      .leftJoinAndSelect('productvariant.product', 'product')
      .where(
        'order.userId = :userId AND orderItems.status = :status AND orderItems.choosen = :choosen',
        { userId: id, status: OrderItemStatus.IN_CART, choosen: true },
      )
      .getOne();
    if (!orderItem)
      return {
        message: 'Không tìm thấy',
        status: statusResponse.NOT_FOUND,
      };
    return orderItem;
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<CreateOrderDto>,
  ): Promise<{ message: string; status: HttpStatus }> {
    // Kiểm tra sự tồn tại của đơn hàng
    const existingOrder = await this.orderRepository.findOne({
      where: { id, userId },
    });

    if (!existingOrder) {
      throw new HttpException(`Order ${id} not found`, HttpStatus.NOT_FOUND);
    }

    // Cập nhật các giá trị cho phép (loại bỏ những giá trị không hợp lệ nếu cần)
    if (updateData.address) existingOrder.address = updateData.address;
    if (updateData.phone) existingOrder.phone = updateData.phone;
    if (updateData.promotion !== undefined) {
      existingOrder.promotion = updateData.promotion;
    }
    if (updateData.paymentMethod) {
      existingOrder.paymentMethod = updateData.paymentMethod;
    }

    // Cập nhật phí vận chuyển nếu địa chỉ thay đổi
    if (updateData.address) {
      existingOrder.shippingFee = updateData.shippingFee;
    }

    // Nếu cần, tính toán lại VAT và tổng tiền
    // if (updateData.orderItems && updateData.orderItems.length > 0) {
    //   let total = 0;

    //   for (const item of updateData.orderItems) {
    //     // Tìm OrderItem từ DB
    //     const orderItem = await this.orderItemRepository.findOne({
    //       where: { id: item.id, expired: false, choosen: true },
    //       select: ['price', 'amount'],
    //     });

    //     if (orderItem) {
    //       total += orderItem.price * orderItem.amount;
    //     }
    //   }

    //   // Cập nhật VAT và tổng tiền
    //   existingOrder.total = total + existingOrder.shippingFee;
    //   if (updateData.isVAT) await this.processOrderWithVAT(existingOrder);
    //   if (updateData.promotion)
    //     existingOrder.total = existingOrder.total - existingOrder.promotion;
    // }
    existingOrder.total = existingOrder.total + existingOrder.shippingFee || 0;
    if (updateData.isVAT) await this.processOrderWithVAT(existingOrder);
    if (updateData.promotion)
      existingOrder.total = existingOrder.total - existingOrder.promotion;
    // Lưu lại đơn hàng
    await this.orderRepository.save(existingOrder);

    return {
      message: `Order ${id} updated successfully`,
      status: HttpStatus.ACCEPTED,
    };
  }

  async checkout(data, id, userId) {
    const order = await this.findOne(id, userId);
    const orderCode = await generateRandomCode(20, true);
    if (data.paymentMethod === PaymentMethod.CASH) {
      order.status = OrderStatus.IN_PROGRESS;
      order.orderCode = orderCode;
      order.paymentMethod = PaymentMethod.CASH;
      await order.save();
    } else if (data.paymentMethod === PaymentMethod.BANK_TRANSFER) {
      if (this.checkPaidWithQRcode(data.total, id)) {
        order.status = OrderStatus.IN_PROGRESS;
        order.orderCode = orderCode;
        order.paymentMethod = PaymentMethod.BANK_TRANSFER;
        await order.save();
      }
    }
  }

  async getQRcode(total: number, orderId) {
    return QRcodeGenerate(total, orderId);
  }

  async checkPaidWithQRcode(total, orderId) {
    const response = await fetch(
      'https://script.googleusercontent.com/macros/echo?user_content_key=4l2V_zLY6RDgWhCkwNkLxTJTeLsfxA7CnXrO8AHqBEVSuvqrKvd426ksgnwtrptMfCS53YiOrCsTXxjtiZVyGJ1CMLcZFMmEm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnM-cBZX6OSIaSYezCVUuYOWNXoPPKhMZ-dVe37RJOarDHFamk2t2qlaLV1yj3ZiHOVo5VjY6wo0rNXzbFR5_N4N6VHsEMrVhUtz9Jw9Md8uu&lib=MF_yw9VprfKP4mdnwD7lFl9VZ0C0-SvPR',
    );
    const data = await response.json();
    const lastPaid = data.data[data.data.length - 1];
    const lastTotal = lastPaid['Giá trị'];
    const lastContent = lastPaid['Mô tả'];
    if (lastTotal >= total && lastContent.include(orderId)) {
      return true;
    }
    return false;
  }

  async delete(id: string, userId: string): Promise<any> {
    const order = await this.findOne(id, userId);
    if (order) {
      order.status = OrderStatus.CANCEL;
      await order.save();
      return {
        message: `Order ${id} cancel successfully`,
        status: HttpStatus.ACCEPTED,
      };
    }
    throw new HttpException(`Order ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
