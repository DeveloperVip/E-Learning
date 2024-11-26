import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserAddressService } from './address.service';
import { UserAddressEntity } from './domain/address.entity';
@Controller('addresses')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  async create(
    @Body('userId') userId: string,
    @Body() addressData: Partial<UserAddressEntity>,
  ): Promise<UserAddressEntity> {
    return this.userAddressService.create(userId, addressData);
  }

  @Get()
  async findAll(@Query('userId') userId: string): Promise<UserAddressEntity[]> {
    return this.userAddressService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserAddressEntity> {
    return this.userAddressService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<UserAddressEntity>,
  ): Promise<UserAddressEntity> {
    return this.userAddressService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.userAddressService.delete(id);
    return { message: 'Address deleted successfully' };
  }
}
