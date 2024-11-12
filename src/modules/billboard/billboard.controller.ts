import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { BillboardService } from './billboard.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateBillboardDTO } from './dto/billboard.dto';
import { BillboardEntity } from './domain/billboard.entity';

@Controller('billboard')
@ApiTags('Billboard')
export class BillboardController {
  constructor(private BillboardService: BillboardService) {}

  @Get('get-all')
  async getAllBillboards(): Promise<BillboardEntity[]> {
    return this.BillboardService.findAll(); // Gọi service để lấy tất cả các bảng quảng cáo
  }

  // Endpoint lấy bảng quảng cáo theo ID
  @Get('/get:id')
  async getBillboardById(@Param('id') id: string): Promise<BillboardEntity> {
    const billboard = await this.BillboardService.findOne(id); // Gọi service để lấy bảng quảng cáo theo ID

    if (!billboard) {
      throw new NotFoundException('Billboard not found'); // Nếu không tìm thấy, trả về 404
    }

    return billboard;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiProperty({ type: CreateBillboardDTO })
  public async create(@Body() data, @Param() storeId: string) {
    const dataBillboard: CreateBillboardDTO = {
      ...data,
      storeId,
    };
    await this.BillboardService.createBillboard(dataBillboard);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateBillboard(
    @Param('id') id: string,
    @Body() updateData: Partial<BillboardEntity>,
  ): Promise<BillboardEntity> {
    return this.BillboardService.update(id, updateData); // Gọi service để cập nhật bảng quảng cáo
  }

  // Endpoint xóa bảng quảng cáo
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBillboard(@Param('id') id: string): Promise<void> {
    return this.BillboardService.remove(id); // Gọi service để xóa bảng quảng cáo
  }
}
