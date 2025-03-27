import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Reserva } from './reservas/reserva.entity';
import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

// Validar las variables de entorno
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('⚠️ Faltan variables de entorno para configurar la base de datos');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Reserva],
      synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
      ssl: {
        rejectUnauthorized: false, // Para conexión con SSL en Render
      },
    }),
    TypeOrmModule.forFeature([Reserva]),
    AuthModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class AppModule {}