import '@shared/env-loader';
import { NestFactory } from '@nestjs/core';
import { devConfig } from '@modules/app/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DOMAIN, PORT } from '@config';
import { Logger } from '@nestjs/common';
import { AppModule } from '@modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // const config = new DocumentBuilder()
  //   .setTitle('API E-Learning')
  //   .setDescription('API Description')
  //   .setVersion('2.0')
  //   .addBearerAuth()
  //   .build();
  // const documnet = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, documnet);
  devConfig(app);
  await app.listen(PORT, DOMAIN, () => {
    Logger.log(`Nest listening on http://${DOMAIN}:${PORT}`);
  });
}
bootstrap();
