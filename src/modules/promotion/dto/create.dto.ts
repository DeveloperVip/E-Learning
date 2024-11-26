import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromotionDto {
  @ApiProperty({
    description: 'Tên của khuyến mại',
    example: 'Giảm giá 20% cho sản phẩm A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về khuyến mại',
    example: 'Giảm giá 20% cho sản phẩm A của thương hiệu X',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Ngày bắt đầu của khuyến mại',
    example: '2024-12-01',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'Ngày kết thúc của khuyến mại',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Loại khuyến mại (percent, fixed, free_shipping)',
    enum: ['percent', 'fixed', 'free_shipping'],
    example: 'percent',
  })
  @IsEnum(['percent', 'fixed', 'free_shipping'])
  type: 'percent' | 'fixed' | 'free_shipping';

  @ApiProperty({
    description: 'Giá trị giảm (phần trăm hoặc cố định)',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @ApiProperty({
    description: 'Số lượng tối đa sản phẩm được áp dụng khuyến mại',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @ApiProperty({
    description: 'Số lượng khuyến mại đã được áp dụng',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  appliedQuantity?: number;

  @ApiProperty({
    description: 'Khuyến mại có áp dụng toàn cục hay không',
    example: true,
  })
  @IsBoolean()
  isGlobal: boolean;

  @ApiProperty({
    description: 'Khuyến mại có đang hoạt động hay không',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Các thuộc tính đặc biệt của khuyến mại',
    example: ['new_customer', 'black_friday'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  property?: string[]; // Trường property có thể là mảng chuỗi
}
