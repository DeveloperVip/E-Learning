import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './domain/users.entity';
import { isDefined } from 'class-validator';
import { compare, hash as hashBcrypt } from 'bcryptjs';
import { LoginDto } from './dto/login-user.dto';
import { ResponseLoginDto } from './dto/response-login-dto';
import { statusResponse } from './status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    private readonly AuthService: AuthService,
  ) {}

  public async createUser(userInfo: CreateUserDto): Promise<string> {
    const user: UserEntity = await this.UserRepository.findOne({
      where: { email: userInfo.email },
    });
    if (!isDefined(user)) {
      const hashedPassword = await hashBcrypt(userInfo.password, 10);
      const newUser = await this.UserRepository.save({
        ...userInfo,
        password: hashedPassword,
      });

      const verificationToken = this.AuthService.generateVerificationToken(
        newUser.email,
      );
      return newUser.id;
    }
    return user.id;
  }

  async validateLogin(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const user: CreateUserDto = await this.UserRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['userName', 'fullName', 'email', 'password'],
    });

    if (!user) {
      const response: ResponseLoginDto = {
        data: null,
        status: statusResponse.ERROR,
        message: 'Incorrect user ',
      };
      return response;
    }

    const isValidPassword = await compare(loginDto.password, user.password);

    if (!isValidPassword) {
      const response: ResponseLoginDto = {
        data: null,
        status: statusResponse.ERROR,
        message: 'Incorrect password',
      };
      return response;
    }

    //register token
    const token = await this.AuthService.signToken(user);
    const response: ResponseLoginDto = {
      data: token,
      status: statusResponse.SUCCESS,
      message: 'login success',
    };
    return response;
  }
}
