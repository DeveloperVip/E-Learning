import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'The price of the product variant',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The remaining quantity of the product variant',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  remainingQuantity: number;

  @ApiProperty({
    description: 'The quantity of the product variant that has been sold',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  quantitySold: number;

  @ApiProperty({
    description: 'Indicates if the product variant is archived',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({
    description: 'Indicates if the product variant is featured',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;

  storeId: string;

  productId: string;

  @ApiProperty({
    description: 'The ID of the associated color variant',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  colorId: string;

  @ApiProperty({
    description: 'The ID of the associated size variant',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  sizeId: string;

  @ApiProperty({
    description: 'An array of image URLs for the product variant',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls: string[];

  @ApiProperty({
    description:
      'The type of promotion for the product variant (fixed or percent)',
    enum: ['fixed', 'percent'],
    default: 'fixed',
  })
  @IsEnum(['fixed', 'percent'])
  @IsOptional()
  promotionType: 'fixed' | 'percent';

  @ApiProperty({
    description: 'The value of the promotion (amount or percentage)',
    type: Number,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  promotionValue: number;
}
