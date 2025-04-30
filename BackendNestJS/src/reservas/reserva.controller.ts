// reserva.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async resetearReservas(): Promise<{ message: string }> {
    try {
      await this.reservaService.resetearTodas();
      return { message: 'Reservas eliminadas correctamente' };
    } catch (error) {
      console.error('Error en resetearReservas:', error);
      throw new HttpException('Error al eliminar reservas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}