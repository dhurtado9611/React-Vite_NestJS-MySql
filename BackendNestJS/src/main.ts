import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Configuración de CORS
  app.enableCors({
    origin: [
      'https://react-vite-nest-js-my-ds74mxdem-danielhurtados-projects.vercel.app',
      'https://react-vite-nest-js-my-sql.vercel.app',
      'https://elesconditemotel.lat',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`Aplicación corriendo en el puerto: ${PORT}`);
}

bootstrap();