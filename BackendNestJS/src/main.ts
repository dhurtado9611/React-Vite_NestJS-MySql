import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir solicitudes desde el dominio del frontend
  app.enableCors({
    origin: 'https://react-vite-nest-js-my-ds74mxdem-danielhurtados-projects.vercel.app', // Permitir solo tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Si usas cookies o autenticación
  });

  await app.listen(3000);
}
bootstrap();