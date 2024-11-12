import { ApiProperty } from '@nestjs/swagger';

export class CreateBillboardDTO {
  @ApiProperty({ example: 'label' })
  label: string;
  storeId: string;
  @ApiProperty({ example: 'Url' })
  imageUrl: string;
}
