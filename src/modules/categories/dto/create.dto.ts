import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO {
  storeId?: string;
  billboardId?: string;
  @ApiProperty({ example: 'Name Category' })
  name: string;
}
