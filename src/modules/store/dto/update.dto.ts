import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto {
  id?: string;

  @ApiProperty({ example: 'name' })
  name: string;
}
