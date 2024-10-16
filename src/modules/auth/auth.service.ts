import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async signToken(
    user: Omit<CreateUserDto, 'password'>,
  ): Promise<string> {
    const secret = this.configService.get<string>('SECRETKEY');
    const userObject = { ...user };
    const token = this.jwtService.signAsync(userObject, { secret: secret });
    return token;
  }

  public generateVerificationToken(email: string): string {
    return Buffer.from(email).toString('base64');
  }
}
