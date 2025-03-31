// main.ts (correcto para Railway)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://react-vite-nest-js-my-ds74mxdem-danielhurtados-projects.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const PORT = process.env.PORT || 3000; // 👈 importante usar process.env.PORT
  await app.listen(PORT, '0.0.0.0');      // 👈 Añade '0.0.0.0' explícitamente
  console.log(`Aplicación corriendo en el puerto: ${PORT}`);
}

bootstrap();