import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('API E-Learning')
    .setDescription('API Description')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const documnet = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documnet);
  await app.listen(3000);
}
bootstrap();
