import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { ColorService } from './color.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  // Delete,
  Param,
  Post,
  // Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateColorDTO } from './dto/color.dto';

@Controller('color')
@ApiTags('Color')
export class ColorController {
  constructor(private readonly ColorService: ColorService) {}

  //create color
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create/:storeId')
  @ApiBody({ type: CreateColorDTO })
  async createColorController(
    @Param('storeId') storeId: string,
    @Body() req: CreateColorDTO,
  ) {
    const data = {
      ...req,
      storeId: storeId,
    };
    return this.ColorService.createColor(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  async getColorById(@Param('id') id: string) {
    return await this.ColorService.findById(id);
  }

  @Get('get-all')
  async getAllColor() {
    return await this.ColorService.findAllColor();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-by-user/:storeId')
  async getColorByUser(@Param('storeId') storeId: string) {
    return await this.ColorService.findByUser(storeId);
  }
  // //delete color
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:storeId/:id')
  async deleteColorController(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.ColorService.deleteColor(id, storeId);
  }
}
