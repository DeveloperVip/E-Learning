import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create-user')
  public async createUser(@Body() userInfo: CreateUserDto) {
    return this.usersService.createUser(userInfo);
  }

  @Post('/login')
  public async userLogin(@Body() userLogin: LoginDto) {
    return this.usersService.validateLogin(userLogin);
  }
}
