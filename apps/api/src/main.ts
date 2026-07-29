import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000', 'https://*.proyectos.cristiancode.dev'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const port = process.env.APPPORT || 3001;
  await app.listen(port);
  console.log(`📚 ReadStack API running on http://localhost:${port}`);
}

bootstrap();
