import { statusResponse } from 'src/modules/users/status.enum';

export class ProductResponseDto {
  data: any;
  status: statusResponse;
  message: string;
}
