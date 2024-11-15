import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('/create-user')
  // public async createUser(@Body() userInfo: CreateUserDto) {
  //   return await this.usersService.createUser(userInfo);
  // }

  // @Post('/authentication')
  // public async confirmUser(@Body() confirmationCode: number) {
  //   return await this.usersService.createUser(confirmationCode);
  // }

  @Post('/find')
  public async userLogin(@Body() userLogin: LoginDto) {
    return await this.usersService.findUser(userLogin.email);
  }
}
