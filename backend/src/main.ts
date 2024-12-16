import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
