import { Module } from '@nestjs/common';

import { AuthLibModule } from 'src/libs/auth-lib/auth.lib.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthLibModule],
  controllers: [AuthController],
  providers: [AuthLibModule],
})
export class AuthModule {}
