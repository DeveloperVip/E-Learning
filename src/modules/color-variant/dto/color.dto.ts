import { IsNotEmpty } from 'class-validator';
import { IColor } from '../domain/color.model';
import { ApiProperty } from '@nestjs/swagger';

export type ICreateColorDTO = Omit<IColor, 'id' | 'updateAt' | 'createAt'>;

export class CreateColorDTO implements ICreateColorDTO {
  storeId?: string;

  @ApiProperty({ example: 'name color' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'value color' })
  @IsNotEmpty()
  value: string;
}
