import '@shared/env-loader';
import { NestFactory } from '@nestjs/core';
import { devConfig } from '@modules/app/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DOMAIN, PORT } from '@config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  devConfig(app);
  await app.listen(PORT, DOMAIN, () => {
    Logger.log(`Nest listening on http://${DOMAIN}:${PORT}`);
  });
}
bootstrap();
