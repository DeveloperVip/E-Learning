import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { LoginDto } from 'src/modules/users/dto/login-user.dto';
import { ResponseLoginDto } from 'src/modules/users/dto/response-login-dto';
import { statusResponse } from 'src/modules/users/status.enum';
import { isDefined } from 'class-validator';
import { EmailService } from 'src/modules/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly UsersService: UsersService,
    private readonly EmailModule: EmailService,
  ) {}

  public async validateUser(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const user: CreateUserDto = await this.UsersService.findUser(
      loginDto.email,
    );

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const response: ResponseLoginDto = {
      data: userWithoutPassword,
      status: statusResponse.SUCCESS,
      message: 'success',
    };
    return response;
  }

  public async login(userInfo): Promise<ResponseLoginDto> {
    //register token
    const user: any = await this.UsersService.findUser(userInfo.email);
    const token = await this.signToken(user);
    const response: ResponseLoginDto = {
      data: token,
      status: statusResponse.SUCCESS,
      message: 'login success',
    };
    return response;
  }

  public async signToken(
    user: Omit<CreateUserDto, 'password'>,
  ): Promise<string> {
    const secret = this.configService.get<string>('SECRETKEY');
    const userObject = { ...user };
    const token = this.jwtService.signAsync(userObject, { secret: secret });
    return token;
  }

  public generateVerificationToken(email: string): string {
    return Buffer.from(email).toString('base64');
  }

  public async createUser(userInfo: CreateUserDto): Promise<string> {
    const user: any = await this.UsersService.findUser(userInfo.email);
    if (!isDefined(user)) {
      const newUser = await this.UsersService.createUser(user);

      const verificationToken = this.generateVerificationToken(newUser.email);

      await this.EmailModule.sendVerificationEmail(
        newUser.email,
        verificationToken,
      );
      return newUser.id;
    }
    return user.id;
  }
}
