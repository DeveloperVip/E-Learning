import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/libs/auth-lib/auth.lib.service';
import { LocalAuthGuard } from 'src/libs/auth-lib/local-auth.guard';
import { LoginDto } from '../users/dto/login-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly AuthLibService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    try {
      return this.AuthLibService.login(req.user.data);
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'An error occurred during login',
      };
    }
  }
}
