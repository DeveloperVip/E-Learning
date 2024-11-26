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
    try {
      this.logger.log(userInfo);

      // Check if user already exists
      const existUser = await this.UserRepository.findOne({
        where: [{ email: userInfo.email }, { userName: userInfo.userName }],
      });
      this.logger.log(existUser);

      if (existUser) {
        if (existUser.email === userInfo.email) {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
        if (existUser.userName === userInfo.userName) {
          throw new HttpException(
            'Username already exists',
            HttpStatus.CONFLICT,
          );
        }
      }

      // Hash the password
      const hashedPassword = await hashBcrypt(userInfo.password, 10);

      // Generate confirmation code
      const confirmationCode = await generateRandomCode(6);

      // Save the new user
      const newUser = await this.UserRepository.save({
        ...userInfo,
        password: hashedPassword,
        confirmationCode,
        isConfirmed: false,
        isDeleted: false,
      });
      this.logger.log(newUser);

      return newUser;
    } catch (err) {
      this.logger.error(`Error creating user: ${err.message}`);
      throw new HttpException(
        `Error creating user: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUser(email: string): Promise<CreateUserDto> {
    try {
      const user = await this.UserRepository.findOne({
        where: { email },
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

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(user.email, user.password);
      return user;
    } catch (err) {
      this.logger.error(`Error finding user: ${err.message}`);
      throw new HttpException(
        `Error finding user: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmUser(confirmationCode: number, email: string): Promise<any> {
    try {
      const user = await this.findUser(email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(confirmationCode, user.confirmationCode);

      // Check if confirmation codes match
      if (Number(user.confirmationCode) === Number(confirmationCode)) {
        user.isConfirmed = true; // Confirm the user
        await this.UserRepository.save(user);
        return { message: 'User confirmed successfully' };
      } else {
        throw new HttpException(
          'Invalid confirmation code',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      this.logger.error(`Error confirming user: ${err.message}`);
      throw new HttpException(
        `Error confirming user: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async saveUser(user): Promise<UserEntity> {
    return this.UserRepository.save(user);
  }
}
