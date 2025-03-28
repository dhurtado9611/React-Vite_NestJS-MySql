import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Permitir solicitudes desde desarrollo y producción
  app.enableCors({
    origin: [
      'http://localhost:5173', // Desarrollo local
      'https://www.elesconditemotel.lat', // Dominio personalizado
      'https://react-vite-nest-js-my-sql.vercel.app' // Dominio en Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Permitir cookies o autenticación con credenciales
  });

  console.log('🚀 Servidor iniciado correctamente');

  await app.listen(3000);
}
bootstrap();