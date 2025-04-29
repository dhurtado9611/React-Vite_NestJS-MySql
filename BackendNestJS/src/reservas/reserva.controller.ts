import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Repository } from 'typeorm';

@Controller('reservas')
export class ReservaController {
  constructor(
    private readonly reservaService: ReservaService,
    @InjectRepository(Reserva) private readonly reservaRepo: Repository<Reserva>
  ) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservaService.remove(+id);
  }

  @Delete('reset')
  async resetReservas() {
    await this.reservaRepo.query('TRUNCATE TABLE reserva');
    return { message: 'Reservas reiniciadas correctamente' };
  }
}