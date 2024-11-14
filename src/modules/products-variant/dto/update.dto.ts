import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  IsString,
} from 'class-validator';

export class UpdateProductVariantDto {
  @ApiProperty({
    description: 'The price of the product variant',
    type: Number,
  })
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'The remaining quantity of the product variant',
    type: Number,
  })
  @IsNumber()
  remainingQuantity?: number;

  @ApiProperty({
    description: 'The quantity of the product variant that has been sold',
    type: Number,
  })
  @IsNumber()
  quantitySold?: number;

  @ApiProperty({
    description: 'Indicates if the product variant is archived',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({
    description: 'Indicates if the product variant is featured',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'The ID of the associated color variant',
    type: String,
  })
  @IsUUID()
  colorId?: string;

  @ApiProperty({
    description: 'The ID of the associated size variant',
    type: String,
  })
  @IsUUID()
  sizeId?: string;

  @ApiProperty({
    description: 'An array of image URLs for the product variant',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  // @ApiProperty({
  //   description: 'Delete image URLs',
  //   type: [String],
  //   required: false,
  // })
  // @IsArray()
  // @IsString({ each: true })
  // @IsOptional()
  // imageUrlsDelete?: string[];
}
