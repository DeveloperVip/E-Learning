import {
  Controller,
  Get,
  // Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Post,
  Response,
} from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { OrderItemEntity } from './domain/orderItem.entity';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
// import { CreateOrderItemDto } from './dto/create.dto';
import { UpdateOrderItemDto } from './dto/update.dto';
import { CreateOrderItemDto } from './dto/create.dto';

@Controller('order-items')
@ApiTags('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() orderItemData: Partial<CreateOrderItemDto>,
    @Response() res,
  ): Promise<any> {
    const newItem = await this.orderItemService.create(orderItemData);
    if (newItem) return res.status(201).json('Tạo order item thành công');
    else
      return res
        .status(400)
        .json('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<OrderItemEntity[]> {
    return await this.orderItemService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-by-id/:id')
  async findOne(@Param('id') id: string): Promise<OrderItemEntity | null> {
    return await this.orderItemService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @ApiProperty({ type: PartialType<UpdateOrderItemDto> })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<UpdateOrderItemDto>,
  ): Promise<OrderItemEntity> {
    console.log(updateData);

    return await this.orderItemService.update(id, updateData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.orderItemService.delete(id);
  }
}
