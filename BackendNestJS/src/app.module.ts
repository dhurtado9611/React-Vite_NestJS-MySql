import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Reserva } from './reservas/reserva.entity';
import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33065, // Asegúrate de que coincida con el puerto de MySQL
      username: 'dhurt9611',
      password: '', // Si tienes contraseña, ponla aquí
      database: 'reservas_motel', // Tu base de datos
      entities: [Reserva], // Las entidades que vas a utilizar
      synchronize: true, // Activa la sincronización automática
    }),
    TypeOrmModule.forFeature([Reserva]),
    AuthModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class AppModule {}
