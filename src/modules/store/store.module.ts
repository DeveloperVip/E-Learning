import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './domain/store.entity';
import { StoreService } from './store.service';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity]), AuthLibModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [],
})
export class StoreModule {}
