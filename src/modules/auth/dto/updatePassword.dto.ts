import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'abcd@1234' })
  oldPassword: string;

  @ApiProperty({ example: 'abcd@1234' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  newPassword: string;
}
