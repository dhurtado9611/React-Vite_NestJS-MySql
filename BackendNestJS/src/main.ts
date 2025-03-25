import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Permitir solicitudes desde el frontend (localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173', // Asegúrate de que coincida con el puerto de Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Permitir cookies o autenticación con credenciales
  });
  
  console.log('Servidor iniciado correctamente por CPANEL');

  await app.listen(3000);
}
bootstrap();
