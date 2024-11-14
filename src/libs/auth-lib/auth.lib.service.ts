import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { LoginDto } from 'src/modules/users/dto/login-user.dto';
import { ResponseLoginDto } from 'src/modules/users/dto/response-login-dto';
import { statusResponse } from 'src/modules/users/status.enum';
// import { isDefined } from 'class-validator';
import { EmailService } from '@shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly UsersService: UsersService,
    private readonly EmailService: EmailService,
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
    if (user && user.isConfirmed) {
      const token = await this.signToken(user);
      const response: ResponseLoginDto = {
        data: token,
        status: statusResponse.SUCCESS,
        message: 'login success',
      };
      return response;
    } else
      throw new HttpException(
        'Account has not been created yet ',
        HttpStatus.NOT_FOUND,
      );
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

  public async createUser(userInfo: CreateUserDto): Promise<any> {
    try {
      const newUser = await this.UsersService.createUser(userInfo);

      // Gửi email xác nhận cho người dùng với mã xác nhận
      await this.EmailService.sendVerificationEmail(
        newUser.email,
        newUser.confirmationCode,
      );

      // Trả về URL hoặc thông báo để frontend chuyển hướng
      return {
        message:
          'User created successfully. Please check your email to verify your account.',
        redirectUrl: `/confirm-code?email=${newUser.email}`,
      };
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi
      if (error)
        throw new HttpException(
          'Failed to create user or send verification email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async authenticateCreateUser(email, confirmationCode): Promise<any> {
    await this.UsersService.confirmUser(confirmationCode, email);
  }
}
