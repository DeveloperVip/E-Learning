import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './modules/auth/jwt.stratery';
import { AuthConfigModule } from './modules/auth/auth.config.module';

@Module({
  imports: [
    AuthConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'duongsecret',
      database: 'E_Learning',
      schema: 'E_Learning_1',
      entities: [__dirname + '/modules/**/domain/*.entity{.ts,.js}'],
    }),

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
