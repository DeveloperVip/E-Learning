import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SizeService } from './size.service';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { CreateSizeDTO } from './dto/size.dto';
import { SizeEntity } from './domain/size.entity';

@Controller('size')
@ApiTags('Size')
export class SizeController {
  constructor(private readonly SizeService: SizeService) {}

  @Get('/get-size-by-id/:id')
  async GetSizeById(@Param('id') id: string): Promise<SizeEntity> {
    return await this.SizeService.getSizeById(id);
  }

  @Get('get-all')
  async GetSizeAll(): Promise<SizeEntity[]> {
    return await this.SizeService.getSizeAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-all-by-user/:storeId')
  async GetByUser(@Param('storeId') storeId: string): Promise<SizeEntity[]> {
    return await this.SizeService.findByUser(storeId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create/:storeId')
  @ApiBody({ type: CreateSizeDTO })
  async CreateSizeController(
    @Body() data: CreateSizeDTO,
    @Param('storeId') storeId: string,
  ) {
    const dataSize: CreateSizeDTO = {
      ...data,
      storeId: storeId,
    };
    return await this.SizeService.createSize(dataSize);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:storeId/:sizeId')
  async DeleteSizeController(
    @Param('storeId') storeId: string,
    @Param('sizeId') sizeId: string,
  ) {
    await this.SizeService.deleteSize({ storeId: storeId, id: sizeId });
  }
}
