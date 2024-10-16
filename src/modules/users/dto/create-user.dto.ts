import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
  password: string;
}
