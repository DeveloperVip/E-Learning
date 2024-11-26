import {
  Body,
  Controller,
  Logger,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/libs/auth-lib/auth.lib.service';
import { LocalAuthGuard } from 'src/libs/auth-lib/local-auth.guard';
import { LoginDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { AuthenticateCreateUserDto } from './dto/auth.dto';
import { JwtAuthGuard } from '@libs/auth-lib/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private readonly AuthLibService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    try {
      this.logger.log(req.user.data);
      return this.AuthLibService.login(req.user.data);
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'An error occurred during login',
      };
    }
  }

  @Post('/create-user')
  @ApiBody({ type: CreateUserDto })
  public async createUser(@Body() userInfo: CreateUserDto) {
    // this.logger.log('user', userInfo);
    return await this.AuthLibService.createUser(userInfo);
  }

  @Post('/authenticate-account')
  @ApiProperty({ type: AuthenticateCreateUserDto })
  public async authenticateCreateUser(
    @Body() body: AuthenticateCreateUserDto,
    @Query('email') email: string,
  ) {
    return await this.AuthLibService.authenticateCreateUser(
      email,
      body.confirmationCode,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update/password')
  @ApiProperty({ type: UpdatePasswordDto })
  async updatePassword(@Request() req, @Body() data: UpdatePasswordDto) {
    return this.AuthLibService.updatePassword(
      data.oldPassword,
      req.user.email,
      data.newPassword,
    );
  }
}
