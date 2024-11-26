import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '@modules/cart/domain/cart.entity';
import {
  OrderItemEntity,
  OrderItemStatus,
} from '@modules/order-items/domain/orderItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  // Get a cart by user ID, including its associated order items
  async getCartByUserId(userId: string): Promise<CartEntity | null> {
    return await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'productvariant')
      .leftJoinAndSelect('productvariant.images', 'images')
      .leftJoinAndSelect('productvariant.product', 'product')
      .where('cart.userId = :userId', { userId })
      .getOne();
  }

  // Add an item to the cart
  async CreateCart(
    userId: string,
    productId: string,
    amount: number,
    price: number,
  ): Promise<CartEntity> {
    let cart = await this.getCartByUserId(userId);

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        total: 0,
        orderItems: [],
      });
      await this.cartRepository.save(cart);
    }

    const existingItem = cart.orderItems.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.amount += amount;
      await this.orderItemRepository.save(existingItem);
    } else {
      // Create a new order item for the cart
      const cartItem = this.orderItemRepository.create({
        cartId: cart.id,
        productId,
        amount,
        price,
        status:
          'in cart' === OrderItemStatus.IN_CART
            ? OrderItemStatus.IN_CART
            : OrderItemStatus.ORDERING,
      });
      await this.orderItemRepository.save(cartItem);
      cart.orderItems.push(cartItem);
    }

    // Recalculate the total price of the cart
    cart.total = await this.calculateCartTotal(cart.id);
    await this.cartRepository.save(cart);

    return cart;
  }

  // Calculate the total price of the cart
  async calculateCartTotal(cartId: string): Promise<number> {
    const { total } = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select('SUM(orderItem.price * orderItem.amount)', 'total')
      .where('orderItem.cartId = :cartId', { cartId })
      .andWhere(
        'orderItem.expired = :expired AND orderItem.choosen = :choosen',
        { expired: false, choosen: true },
      )
      .getRawOne();

    return total || 0;
  }

  // Increase quantity of an item in the cart using createQueryBuilder
  async increaseItemQuantity(
    cartId: string,
    productId: string,
    amount: number,
  ): Promise<CartEntity> {
    const item = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .where(
        'orderItem.cartId = :cartId AND orderItem.id = :productId AND orderItem.expired = :expired',
        { cartId, productId, expired: false },
      )
      .getOne();

    if (!item) throw new NotFoundException('Item not found in cart');

    await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItemEntity)
      .set({ amount: () => `amount + ${amount}` })
      .where('id = :id', { id: item.id })
      .execute();

    return await this.updateCartTotal(cartId);
  }

  // Decrease quantity of an item in the cart or remove it if amount reaches zero using createQueryBuilder
  async decreaseItemQuantity(
    cartId: string,
    productId: string,
    amount: number,
  ): Promise<CartEntity> {
    const item = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .where(
        'orderItem.cartId = :cartId AND orderItem.id = :productId AND orderItem.expired = :expired',
        { cartId, productId, expired: false },
      )
      .getOne();

    if (!item) throw new NotFoundException('Item not found in cart');

    const newAmount = item.amount - amount;
    if (newAmount <= 0) {
      await this.orderItemRepository
        .createQueryBuilder()
        .delete()
        .from(OrderItemEntity)
        .where('id = :id', { id: item.id })
        .execute();
    } else {
      await this.orderItemRepository
        .createQueryBuilder()
        .update(OrderItemEntity)
        .set({ amount: newAmount })
        .where('id = :id', { id: item.id })
        .execute();
    }

    return await this.updateCartTotal(cartId);
  }

  // Remove an item from the cart using createQueryBuilder
  async removeItemFromCart(
    cartId: string,
    productId: string,
  ): Promise<CartEntity> {
    await this.orderItemRepository
      .createQueryBuilder()
      .delete()
      .from(OrderItemEntity)
      .where('cartId = :cartId AND productId = :productId', {
        cartId,
        productId,
      })
      .execute();

    return await this.updateCartTotal(cartId);
  }

  // Update the total cost of the cart after modification using createQueryBuilder
  public async updateCartTotal(cartId: string): Promise<CartEntity> {
    const total = await this.calculateCartTotal(cartId);

    await this.cartRepository
      .createQueryBuilder()
      .update(CartEntity)
      .set({ total })
      .where('id = :cartId', { cartId })
      .execute();

    return await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['orderItems'],
    });
  }

  // public async updateCart(
  //   userId: string,
  //   productId: string,
  //   amount: number,
  //   price: number,
  // ): Promise<CartEntity> {
  //   const cart = await this.getCartByUserId(userId);
  //   const existingItem = cart.orderItems.find(
  //     (item) => item.productId === productId,
  //   );

  //   if (existingItem) {
  //     existingItem.amount += amount;
  //     await this.orderItemRepository.save(existingItem);
  //   } else {
  //     // Create a new order item for the cart
  //     const cartItem = this.orderItemRepository.create({
  //       cartId: cart.id,
  //       productId,
  //       amount,
  //       price,
  //       status:
  //         'in cart' === OrderItemStatus.IN_CART
  //           ? OrderItemStatus.IN_CART
  //           : OrderItemStatus.ORDERING,
  //     });
  //     await this.orderItemRepository.save(cartItem);
  //     cart.orderItems.push(cartItem);
  //   }

  //   // Recalculate the total price of the cart
  //   cart.total = await this.calculateCartTotal(cart.id);

  //   await this.cartRepository.save(cart);

  //   return await this.cartRepository.findOne({
  //     where: { id: cartId },
  //     relations: ['orderItems'],
  //   });
  // }

  // Clear all items in the cart
  async clearCart(cartId: string): Promise<void> {
    // Delete all order items from the cart
    await this.orderItemRepository
      .createQueryBuilder()
      .delete()
      .from(OrderItemEntity)
      .where('cartId = :cartId', { cartId })
      .execute();

    // Reset the total of the cart to 0
    await this.cartRepository
      .createQueryBuilder()
      .update(CartEntity)
      .set({ total: 0 })
      .where('id = :cartId', { cartId })
      .execute();
  }

  async convertToOrder(
    status: OrderItemStatus,
    orderItemId: string,
    orderId: string,
  ): Promise<void> {
    const result = await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItemEntity)
      .set({ status, orderId }) // Set the status to the value passed
      .where('id = :id', { id: orderItemId }) // Find the order item by its ID
      .execute();

    if (result.affected === 0) {
      throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
    }
  }
}
