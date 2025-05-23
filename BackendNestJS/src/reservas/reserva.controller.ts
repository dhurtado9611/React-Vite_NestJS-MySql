// reserva.controller.ts
import { Controller, Delete, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Reserva } from './reserva.entity';

@UseGuards(JwtAuthGuard)
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Get()
  findAll(): Promise<Reserva[]> {
    return this.reservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reserva> {
    return this.reservaService.findOne(id);
  }

  @Post()
  create(@Body() reserva: Reserva): Promise<Reserva> {
    return this.reservaService.create(reserva);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() reserva: Reserva): Promise<Reserva> {
    return this.reservaService.update(id, reserva);
  }

  // 🔁 ESTA RUTA DEBE IR ANTES
  @Delete('reset')
  async resetAll() {
    return this.reservaService.resetAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.reservaService.deleteById(id);
  }
}