import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/users.entity';
import { EmailModule } from '../mail/mail.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity]), EmailModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
