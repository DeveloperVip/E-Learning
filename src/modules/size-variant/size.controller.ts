import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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

  @Get('/get-size-by-id:id')
  async GetSizeById(id: string): Promise<SizeEntity> {
    const size = await this.SizeService.getSizeById(id);
    if (!size) {
      throw new NotFoundException('size not exist');
    }
    return size;
  }

  @Get('get-all')
  async GetSizeAll(): Promise<SizeEntity[]> {
    return await this.SizeService.getSizeAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBody({ type: CreateSizeDTO })
  async CreateSizeController(@Body() data, @Param() storeId: string) {
    const dataSize: CreateSizeDTO = {
      ...data,
      storeId: storeId,
    };
    await this.SizeService.createSize(dataSize);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async DeleteSizeController(
    @Param() storeId: string,
    @Param() sizeId: string,
  ) {
    await this.SizeService.deleteSize({ storeId: storeId, id: sizeId });
  }
}
