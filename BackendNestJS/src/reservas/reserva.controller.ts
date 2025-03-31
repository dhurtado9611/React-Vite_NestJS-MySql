import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';

@Controller('reservas')
@UseGuards(JwtAuthGuard) // Protege todas las rutas con JWT
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  create(@Body() reserva: Partial<Reserva>) {
    return this.reservaService.create(reserva);
  }

  @Get()
  findAll() {
    console.log('→ Entró a GET /reservas');
    return this.reservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reservaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() reserva: Partial<Reserva>) {
    return this.reservaService.update(id, reserva);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reservaService.remove(id);
  }
}