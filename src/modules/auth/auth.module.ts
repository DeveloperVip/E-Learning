import { Module } from '@nestjs/common';

import { AuthLibModule } from 'src/libs/auth-lib/auth.lib.module';

@Module({
  imports: [AuthLibModule],
  controllers: [],
  providers: [AuthLibModule],
})
export class AuthModule {}
