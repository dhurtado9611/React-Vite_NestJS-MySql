import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasCliente } from './reservas_cliente.entity';
import { ReservasClienteService } from './reservas_cliente.service';
import { ReservasClienteController } from './reservas_cliente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReservasCliente])],
  controllers: [ReservasClienteController],
  providers: [ReservasClienteService],
  exports: [ReservasClienteService],
})
export class ReservasClienteModule {}