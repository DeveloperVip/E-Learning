import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.lib.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStratery extends PassportStrategy(Strategy) {
  constructor(private readonly AuthService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string) {
    const response = await this.AuthService.validateUser({
      email,
      password,
    });
    if (!response.data) {
      throw new UnauthorizedException();
    }
    return response;
  }
}
