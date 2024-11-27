import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import {
  AddItemToCartDto,
  RemoveItemFromCartDto,
  UpdateItemQuantityDto,
} from './dto/cart.dto';
import { UpdateOrderItemStatusDto } from './dto/status.dto';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get cart by user ID
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-cart')
  async getCartByUserId(@Request() req, @Response() res) {
    const cart = await this.cartService.getCartByUserId(req.user.userId);
    if (!cart) {
      return res.status(404).json('Không tìm thấy giỏ hàng');
    }
    console.log(cart);
    return res.status(200).json(cart);
  }

  // Add item to the cart
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create/add-item')
  async addItemToCart(
    @Body() addItemToCartDto: Partial<AddItemToCartDto>,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const { productId, amount, price } = addItemToCartDto;
    const cart = await this.cartService.CreateCart(
      userId,
      productId,
      amount,
      price,
    );
    return cart;
  }

  // Increase quantity of an item in the cart
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('increase-quantity/:cartId')
  async increaseItemQuantity(
    @Param('cartId') cartId: string,
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ) {
    console.log(cartId, updateItemQuantityDto);

    const { productId, amount } = updateItemQuantityDto;
    return await this.cartService.increaseItemQuantity(
      cartId,
      productId,
      amount,
    );
  }

  // Decrease quantity of an item in the cart
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('decrease-quantity/:cartId')
  async decreaseItemQuantity(
    @Param('cartId') cartId: string,
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ) {
    const { productId, amount } = updateItemQuantityDto;
    return await this.cartService.decreaseItemQuantity(
      cartId,
      productId,
      amount,
    );
  }

  // Remove an item from the cart
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('remove-item/:cartId')
  async removeItemFromCart(
    @Param('cartId') cartId: string,
    @Body() removeItemFromCartDto: RemoveItemFromCartDto,
  ) {
    const { productId } = removeItemFromCartDto;
    return await this.cartService.removeItemFromCart(cartId, productId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-order/:orderId/:orderItemId')
  @ApiProperty({ type: UpdateOrderItemStatusDto })
  async convertToOrder(
    @Param('orderItemId') orderItemId: string,
    @Param('orderId') orderId: string,
    @Body() data: UpdateOrderItemStatusDto,
  ) {
    const { status } = data;
    return await this.cartService.convertToOrder(status, orderItemId, orderId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-cart/:cartId')
  async updateCart(@Param() param) {
    return await this.cartService.updateCartTotal(param.cartId);
  }

  // Clear all items in the cart
  @Delete('clear/:cartId')
  async clearCart(@Param('cartId') cartId: string) {
    await this.cartService.clearCart(cartId);
    return { message: 'Cart cleared successfully' };
  }
}
