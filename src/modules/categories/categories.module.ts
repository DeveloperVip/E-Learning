import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoryEntity } from './domain/categories.entity';
import { AuthLibModule } from '@libs/auth-lib/auth.lib.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), AuthLibModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [],
})
export class CategoriesModule {}
