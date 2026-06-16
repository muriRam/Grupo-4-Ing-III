import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  // Se sube el límite del body porque un chat exportado puede ser grande.
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
