import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressController } from './address.controller';
import { UserAddressService } from './address.service';
import { UserAddressEntity } from './domain/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
  exports: [UserAddressService],
})
export class UserAddressModule {}
