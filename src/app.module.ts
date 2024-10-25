import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './libs/auth-lib/stratery/jwt.stratery';
import { AuthConfigModule } from './modules/auth/auth.config.module';
import { FileUploadModule } from './modules/files/files.module';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthLibModule } from './libs/auth-lib/auth.lib.module';

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
    FileUploadModule,
    AuthModule,
    AuthLibModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, CloudinaryService],
})
export class AppModule {}
