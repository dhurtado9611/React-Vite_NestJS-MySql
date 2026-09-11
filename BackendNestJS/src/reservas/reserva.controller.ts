// reserva.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Get()
  async findAll(): Promise<Reserva[]> {
    return this.reservaService.findAll();
  }

  @Post()
  async create(@Body() reserva: CreateReservaDto): Promise<Reserva> {
    return this.reservaService.create(reserva);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() reserva: UpdateReservaDto): Promise<Reserva> {
    return this.reservaService.update(id, reserva);
  }

  @Delete('reset-todo-456')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async resetearReservas(): Promise<{ message: string }> {
    try {
      await this.reservaService.resetearTodas();
      return { message: 'Reservas eliminadas correctamente' };
    } catch (error) {
      console.error('Error en resetearReservas:', error);
      throw new HttpException('Error al eliminar reservas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.reservaService.remove(id);
  }
}