import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reservas/reserva.entity';
import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'), // Puerto por defecto para PostgreSQL
      username: process.env.DB_USER ?? 'default_user',
      password: process.env.DB_PASSWORD ?? 'default_password',
      database: process.env.DB_NAME ?? 'default_database',
      entities: [Reserva],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: {
        rejectUnauthorized: false,
      },
    }),    
    TypeOrmModule.forFeature([Reserva]),
    AuthModule,
  ],
  controllers: [ReservaController, AppController],
  providers: [ReservaService, AppService],
})
export class AppModule {}