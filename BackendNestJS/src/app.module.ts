import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reservas/reserva.entity';
import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'test',
      entities: [Reserva],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 30000, // Aumenta el tiempo de espera a 30 segundos
    }),       
    TypeOrmModule.forFeature([Reserva]),
    AuthModule,
  ],
  controllers: [ReservaController, AppController],
  providers: [ReservaService, AppService],
})
export class AppModule {}