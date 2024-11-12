import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDTO {
  @ApiProperty({ example: 'name color' })
  name: string;
  storeId?: string;
}
