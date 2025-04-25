import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Reserva } from './reservas/reserva.entity';
import { User } from './auth/user.entity'; // Asegúrate de que la ruta sea correcta
import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';
import { AuthModule } from './auth/auth.module';
import { CuadreModule } from './cuadrecaja/cuadre.module';
import { Cuadre } from './cuadrecaja/cuadre.entity';
import { AdminModule } from './admin/admin.module';
import { ReservasClienteModule } from './cliente/reservas_cliente.module';
import { InventarioModule } from './inventario/inventario.module';
import { Inventario } from './inventario/inventario.entity';


@Module({
  imports: [
    AdminModule,
    ReservasClienteModule,
    InventarioModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.MYSQL_URL, // Usa la variable directamente aquí
      //host: process.env.DB_HOST,
      //port: parseInt(process.env.DB_PORT!, 10) || 3306,
      //username: process.env.DB_USERNAME,
      //password: process.env.DB_PASSWORD,
      //database: process.env.DB_NAME,
      entities: [Reserva, User, Cuadre, Inventario], // Se incluye la entidad User
      synchronize: true, // Solo para desarrollo
    }),
    CuadreModule,
    TypeOrmModule.forFeature([Reserva]),
    AuthModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class AppModule {}
