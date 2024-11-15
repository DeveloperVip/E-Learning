import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './domain/users.entity';
import { hash as hashBcrypt } from 'bcryptjs';
import { generateRandomCode } from '@shared/util/random';
import { EmailService } from '@shared';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    private readonly EmailService: EmailService,
  ) {}

  public async createUser(userInfo): Promise<any> {
    this.logger.log(userInfo);
    const existUser = await this.UserRepository.findOne({
      where: [{ email: userInfo.email }, { userName: userInfo.userName }],
    });
    this.logger.log(existUser);
    if (existUser) {
      if (existUser.email === userInfo.email) {
        throw new HttpException('Email existed', HttpStatus.CONFLICT);
      }
      if (existUser.userName === userInfo.userName) {
        throw new HttpException('UserName existed', HttpStatus.CONFLICT);
      }
    }
    const hashedPassword = await hashBcrypt(userInfo.password, 10);
    const confirmationCode = await generateRandomCode(6);
    const newUser = await this.UserRepository.save({
      ...userInfo,
      password: hashedPassword,
      confirmationCode,
      isConfirmed: false,
    });
    this.logger.log(newUser);

    return newUser;
  }

  async findUser(email: string) {
    const user: CreateUserDto = await this.UserRepository.findOne({
      where: {
        email: email,
      },
      select: [
        'id',
        'userName',
        'fullName',
        'email',
        'password',
        'isConfirmed',
        'confirmationCode',
      ],
    });
    this.logger.log(user.email, user.password);
    return user;
  }

  async confirmUser(confirmationCode: number, email: string) {
    const user = await this.findUser(email);

    if (!user) {
      throw new Error('User not found');
    }
    this.logger.log(confirmationCode, user.confirmationCode);
    if (Number(user.confirmationCode) === Number(confirmationCode)) {
      user.isConfirmed = true; // Xác nhận người dùng
      await this.UserRepository.save(user);
      return { message: 'User confirmed successfully' };
    } else {
      throw new Error('Invalid confirmation code');
    }
  }
}
