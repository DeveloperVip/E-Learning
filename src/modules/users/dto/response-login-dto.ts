import { statusResponse } from '../status.enum';

export interface ResponseLoginDto {
  data: any;
  status: statusResponse;
  message: string;
}
