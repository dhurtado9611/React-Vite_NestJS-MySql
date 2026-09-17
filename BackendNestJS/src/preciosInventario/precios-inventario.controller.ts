import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PreciosInventarioService } from './precios-inventario.service';
import { UpdatePrecioInventarioDto } from './dto/update-precio-inventario.dto';
import { CreatePrecioInventarioDto } from './dto/create-precio-inventario.dto';

@Controller('preciosInventario')
export class PreciosInventarioController {
  constructor(private readonly preciosService: PreciosInventarioService) {}

  // Lectura pública a propósito: el marketplace de invitados carga el
  // catálogo antes de tener garantizado un token en memoria.
  @Get()
  findAll() {
    return this.preciosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePrecioInventarioDto) {
    return this.preciosService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePrecioInventarioDto) {
    return this.preciosService.update(id, dto);
  }
}