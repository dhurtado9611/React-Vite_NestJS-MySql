import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // ⚠️ OJO: Comenta esto temporalmente si quieres probar sin token primero
import { PreciosInventarioService } from './precios-inventario.service';
import { UpdatePrecioInventarioDto } from './dto/update-precio-inventario.dto';
import { CreatePrecioInventarioDto } from './dto/create-precio-inventario.dto'; // Asegúrate de importar esto

// @UseGuards(JwtAuthGuard) // <--- Si el frontend no envía token en el GET inicial, esto bloqueará la carga de productos (Error 403)
@Controller('productos') // CAMBIO IMPORTANTE: De 'preciosInventario' a 'productos'
export class PreciosInventarioController {
  constructor(private readonly preciosService: PreciosInventarioService) {}

  @Get()
  findAll() {
    return this.preciosService.findAll();
  }

  // Agregamos el POST para poder crear productos desde Postman o Frontend si fuera necesario
  @Post()
  create(@Body() dto: CreatePrecioInventarioDto) {
    return this.preciosService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePrecioInventarioDto) {
    return this.preciosService.update(id, dto);
  }
}