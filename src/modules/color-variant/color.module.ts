import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './domain/color.entity';
import { ColorController } from './color.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity])],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
