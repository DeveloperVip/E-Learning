import { IsNotEmpty } from 'class-validator';

export class DeleteSizeDTO {
  @IsNotEmpty()
  storeId: string;

  @IsNotEmpty()
  id: string;
}
