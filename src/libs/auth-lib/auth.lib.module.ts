import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.lib.service';
import { LocalStratery } from './stratery/local.stratery';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratery/jwt.stratery';
import { UsersModule } from 'src/modules/users/users.module';
import { EmailModule } from 'src/modules/mail/mail.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    EmailModule,
    forwardRef(() => UsersModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60s',
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStratery, JwtStrategy, JwtAuthGuard],
  exports: [LocalStratery, AuthService],
})
export class AuthLibModule {}
