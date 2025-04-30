// reserva.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Get()
  async findAll(): Promise<Reserva[]> {
    return this.reservaService.findAll();
  }

  @Post()
  async create(@Body() reserva: Reserva): Promise<Reserva> {
    return this.reservaService.create(reserva);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() reserva: Reserva): Promise<Reserva> {
    return this.reservaService.update(id, reserva);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.reservaService.remove(id);
  }

  @Delete('reset')
  async resetearReservas(): Promise<void> {
    return this.reservaService.resetearTodas();
  }
}