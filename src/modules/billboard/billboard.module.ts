import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillboardController } from './billboard.controller';
import { BillboardService } from './billboard.service';
import { BillboardEntity } from './domain/billboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillboardEntity])],
  controllers: [BillboardController],
  providers: [BillboardService],
  exports: [],
})
export class BillboardModule {}
