import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Reserva } from './reservas/reserva.entity';
import { User } from './auth/user.entity';
import { Cuadre } from './cuadrecaja/cuadre.entity';
import { Inventario } from './inventario/inventario.entity';
import { PreciosInventario } from './preciosInventario/precios-inventario.entity';

import { ReservaService } from './reservas/reserva.service';
import { ReservaController } from './reservas/reserva.controller';

import { AuthModule } from './auth/auth.module';
import { CuadreModule } from './cuadrecaja/cuadre.module';
import { AdminModule } from './admin/admin.module';
import { ReservasClienteModule } from './cliente/reservas_cliente.module';
import { InventarioModule } from './inventario/inventario.module';
import { PreciosInventarioModule } from './preciosInventario/precios-inventario.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [
    AdminModule,
    ReservasClienteModule,
    InventarioModule,
    PreciosInventarioModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.MYSQL_URL,
      entities: [Reserva, User, Cuadre, Inventario, PreciosInventario],
      synchronize: true,
    }),
    CuadreModule,
    ReservasModule,
    AuthModule,
  ],
})
export class AppModule {}