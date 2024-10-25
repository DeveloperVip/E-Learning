import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './domain/users.entity';
import { hash as hashBcrypt } from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  public async createUser(userInfo): Promise<any> {
    const hashedPassword = await hashBcrypt(userInfo.password, 10);
    const newUser = await this.UserRepository.save({
      ...userInfo,
      password: hashedPassword,
    });
    return newUser;
  }

  async findUser(email: string) {
    const user: CreateUserDto = await this.UserRepository.findOne({
      where: {
        email: email,
      },
      select: ['userName', 'fullName', 'email', 'password'],
    });
    this.logger.log(user.email, user.password);
    return user;
  }
}
