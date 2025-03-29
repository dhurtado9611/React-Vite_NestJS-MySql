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
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
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