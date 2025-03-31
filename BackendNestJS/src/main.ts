// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir solicitudes desde tu frontend en Vercel
  app.enableCors({
    origin: 'https://react-vite-nest-js-my-ds74mxdem-danielhurtados-projects.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // 🚨 Aquí está el cambio importante 👇
  await app.listen(process.env.PORT || 3000);
}
bootstrap();