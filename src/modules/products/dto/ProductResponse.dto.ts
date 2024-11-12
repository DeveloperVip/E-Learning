import { statusResponses } from '@shared/enum';
import { statusResponse } from 'src/modules/users/status.enum';

export class ProductResponseDto {
  data: any;
  status: statusResponse | statusResponses;
  message: string;
}
