import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); 
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // --- CONFIGURACIÓN CORS CORREGIDA ---
  app.enableCors({
    // 'origin: true' refleja el origen de la petición, permitiendo la conexión
    // desde tu frontend sin importar si tiene 'www', slash al final, etc.
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`Aplicación corriendo en el puerto: ${PORT}`);
}

bootstrap();