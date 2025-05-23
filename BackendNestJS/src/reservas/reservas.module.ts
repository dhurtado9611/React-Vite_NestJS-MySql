// reservas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservasModule {}