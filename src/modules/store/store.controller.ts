import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, OmitType } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { StoreCreateDTO } from './dto/store.dto';

@Controller('store')
@ApiTags('Store')
export class StoreController {
  constructor(private readonly StoreService: StoreService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBody({ type: OmitType(StoreCreateDTO, ['userId'] as const) })
  public async CreateStoreController(
    @Body() data: StoreCreateDTO,
    @Request() req,
  ) {
    try {
      if (req.user.data) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const storeData = {
        ...data,
        userId: req.user.data,
      };
      return this.StoreService.CreateStore(storeData);
    } catch (err) {
      throw new HttpException(
        `Error internal server: ${err.detail}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/update/:storeId')
  public async UpdateStoreController(
    @Param('storeId') storeId: string,
    @Body() data: StoreCreateDTO,
    @Request() req,
  ) {
    const storeData = {
      ...data,
      id: storeId,
      userId: req.user.data,
    };
    return this.StoreService.UpdateStore(storeData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:storeId')
  public async DeleteStoreController(
    @Param('storeId') storeId: string,
    @Request() req,
  ) {
    const storeData = {
      id: storeId,
      userId: req.user.data,
    };
    return this.StoreService.DeleteStore(storeData);
  }
}
