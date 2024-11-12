import { IsNotEmpty } from 'class-validator';
import { IColor } from '../domain/color.model';

export type ICreateColorDTO = Omit<IColor, 'id' | 'updateAt' | 'createAt'>;

export class CreateColorDTO implements ICreateColorDTO {
  @IsNotEmpty()
  storeId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: string;
}
