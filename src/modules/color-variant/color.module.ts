import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from './domain/color.entity';
import { ColorController } from './color.controller';
import { StoreEntity } from '@modules/store/domain/store.entity';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColorEntity, StoreEntity]),
    AuthLibModule,
  ],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
