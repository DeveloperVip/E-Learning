import { ApiProperty } from '@nestjs/swagger';

// create-brand.dto.ts
export class CreateBrandDTO {
  @ApiProperty({ example: 'name brand' })
  name: string;
  storeId?: string;
}
