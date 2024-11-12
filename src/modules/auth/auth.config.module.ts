import configuration from '@shared/config/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // ignoreEnvFile: false,
      load: [configuration],
    }),
  ],
})
export class AuthConfigModule {}
