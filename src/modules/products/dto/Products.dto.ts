import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  isArchived?: boolean;

  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsNotEmpty()
  brandId: string; // Chỉ cần ID của brand

  @IsString()
  @IsNotEmpty()
  categoryId: string; // Chỉ cần ID của category

  @IsString()
  @IsNotEmpty()
  storeId: string; // Chỉ cần ID của store
}
