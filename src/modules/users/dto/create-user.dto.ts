import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  id?: string;
  @ApiProperty({ example: 'minhchau' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'Minh Chau' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'minhchau@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  password: string;

  confirmationCode?: number;
  isConfirmed?: boolean;
}
