import { Controller, Post, Body, Delete, Param, Get, Query } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './create-inventario.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly service: InventarioService) {}

  @Post()
  create(@Body() data: CreateInventarioDto) {
    return this.service.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('buscar')
  findByTurno(
    @Query('fecha') fecha: string,
    @Query('turno') turno: string,
    @Query('colaborador') colaborador: string
  ) {
    return this.service.findByTurno(fecha, turno, colaborador);
  }
}