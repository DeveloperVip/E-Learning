import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ProductsDto {
  @ApiProperty({
    description: 'The name of the product',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Indicates if the product is archived',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  isArchived?: boolean;

  @ApiProperty({
    description: 'Indicates if the product is featured',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'The ID of the brand associated with the product',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  brandId: string; // Chỉ cần ID của brand

  @ApiProperty({
    description: 'The ID of the category associated with the product',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string; // Chỉ cần ID của category

  @IsNotEmpty()
  storeId: string;
}
