import { ApiProperty } from '@nestjs/swagger';

export class StoreCreateDTO {
  @ApiProperty({ example: 'Name Store' })
  name: string;
  userId?: string;
}
