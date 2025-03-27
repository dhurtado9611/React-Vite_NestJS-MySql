import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Reserva } from './reservas/reserva.entity';
import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Cambiado a PostgreSQL
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10) || 5432, // Puerto por defecto de PostgreSQL
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Reserva], // Las entidades que vas a utilizar
      synchronize: true, // Para desarrollo, desactívalo en producción
    }),
    TypeOrmModule.forFeature([Reserva]),
    AuthModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class AppModule {}