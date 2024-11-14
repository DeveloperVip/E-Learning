import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillboardController } from './billboard.controller';
import { BillboardService } from './billboard.service';
import { BillboardEntity } from './domain/billboard.entity';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';

@Module({
  imports: [TypeOrmModule.forFeature([BillboardEntity]), AuthLibModule],
  controllers: [BillboardController],
  providers: [BillboardService],
  exports: [],
})
export class BillboardModule {}
