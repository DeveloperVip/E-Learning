import { ApiProperty } from '@nestjs/swagger';

export class GetQRCodeDto {
  @ApiProperty({ example: 100, description: 'Total amount for the order' })
  total: number;
}
