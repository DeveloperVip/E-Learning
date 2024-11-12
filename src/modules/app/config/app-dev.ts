import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function devConfig(app: NestExpressApplication): void {
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('API E-Learning')
    .setDescription('API Description')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const documnet = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documnet);
}
