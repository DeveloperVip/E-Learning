import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { ColorService } from './color.service';
import {
  Body,
  Controller,
  // Delete,
  Param,
  Post,
  // Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, OmitType } from '@nestjs/swagger';
import { CreateColorDTO } from './dto/color.dto';

@Controller('color')
@ApiTags('Color')
export class ColorController {
  constructor(private readonly ColorService: ColorService) {}

  //create color
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBody({ type: OmitType(CreateColorDTO, ['storeId'] as const) })
  async createColorController(@Param() storeId: string, @Body() req) {
    const data = {
      ...req,
      stored: storeId,
    };
    return this.ColorService.createColor(data);
  }

  // //delete color
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async deleteColorController(@Param())
}
