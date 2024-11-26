import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity, OrderStatus, PaymentMethod } from './domain/order.entity';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { CreateOrderDto } from './dto';
import { CheckoutDto } from './dto/paymentMethod.dto';
import { GetQRCodeDto } from './dto/QRcode.dto';

@Controller('orders')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiProperty({ type: CreateOrderDto })
  async create(
    @Body() orderData: Partial<CreateOrderDto>,
    @Request() req,
  ): Promise<any> {
    const newData = {
      ...orderData,
      paymentMethod: PaymentMethod.CASH,
      status: OrderStatus.NOT_PAID,
      userId: req.user.userId,
    };
    return await this.orderService.create(newData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async findAll(@Request() req): Promise<OrderEntity[]> {
    return await this.orderService.findAll(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-by-id/:orderId')
  async findOne(
    @Request() req,
    @Param('orderId') orderId: string,
  ): Promise<OrderEntity | null> {
    return await this.orderService.findOne(orderId, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-order-not-paid')
  async findOneOrderNotPaid(@Request() req): Promise<OrderEntity | null> {
    return await this.orderService.findOneOrderNotPaid(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @ApiProperty({ type: CreateOrderDto })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateData: CreateOrderDto,
  ): Promise<any> {
    return await this.orderService.update(id, req.user.userId, updateData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    await this.orderService.delete(id, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('qrcode/:orderId')
  async getQRcode(
    @Param('orderId') orderId: string,
    @Body() dto: GetQRCodeDto,
  ) {
    return this.orderService.getQRcode(dto.total, orderId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout/:id')
  @ApiProperty({ type: CheckoutDto })
  async checkout(
    @Param('id') id: string,
    @Request() req,
    @Body() data: CheckoutDto,
  ): Promise<void> {
    await this.orderService.checkout(data, id, req.user.userId);
  }
}
