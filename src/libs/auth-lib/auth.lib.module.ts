import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.lib.service';
import { LocalStratery } from './stratery/local.stratery';
import { JwtStrategy } from './stratery/jwt.stratery';
import { UsersModule } from 'src/modules/users/users.module';
import { EmailModule } from 'src/modules/mail/mail.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    forwardRef(() => UsersModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        // console.log(configService.get<string>('JWT_SECRET')),
        ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60s',
          },
        }),
    }),

    JwtModule,
  ],
  providers: [AuthService, LocalStratery, JwtStrategy, JwtAuthGuard],
  exports: [LocalStratery, AuthService, JwtModule],
})
export class AuthLibModule {}
