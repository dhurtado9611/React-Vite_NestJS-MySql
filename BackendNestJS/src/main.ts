// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://react-vite-nest-js-my-ds74mxdem-danielhurtados-projects.vercel.app',
      'https://react-vite-nest-js-my-sql.vercel.app',// 👈 Agrega esta nueva URL también
      'https://elesconditemotel.lat'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  
  const PORT = process.env.PORT || 3000;
  // IMPORTANTE: Añadir explícitamente '0.0.0.0' para escuchar en todas las interfaces
  await app.listen(PORT, '0.0.0.0');
  console.log(`Aplicación corriendo en el puerto: ${PORT}`);
}

bootstrap();