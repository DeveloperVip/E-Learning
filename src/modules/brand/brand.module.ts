import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandEntity } from './domain/brand.entity';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity]), AuthLibModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [],
})
export class BrandModule {}
