import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateCreateUserDto {
  @ApiProperty({
    description:
      'The confirmation code sent to the user for account authentication.',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  confirmationCode: string;
}
