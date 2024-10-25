import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.lib.service';

@Injectable()
export class LocalStratery extends PassportStrategy(Strategy) {
  constructor(private readonly AuthService: AuthService) {
    super();
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
