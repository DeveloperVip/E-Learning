import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';
import { Module } from '@nestjs/common';
import { SizeEntity } from './domain/size.entity';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';

@Module({
  imports: [TypeOrmModule.forFeature([SizeEntity]), AuthLibModule],
  controllers: [SizeController],
  providers: [SizeService],
  exports: [],
})
export class SizeModule {}
