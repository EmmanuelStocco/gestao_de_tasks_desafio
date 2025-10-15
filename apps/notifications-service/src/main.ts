import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`Notifications service running on port ${port}`);
}

bootstrap();
