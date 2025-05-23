// precios-inventario.controller.ts
import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PreciosInventarioService } from './precios-inventario.service';
import { UpdatePrecioInventarioDto } from './dto/update-precio-inventario.dto';

@UseGuards(JwtAuthGuard)
@Controller('preciosInventario')
export class PreciosInventarioController {
  constructor(private readonly preciosService: PreciosInventarioService) {}

  @Get()
  findAll() {
    return this.preciosService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePrecioInventarioDto) {
    return this.preciosService.update(id, dto);
  }
}