// src/inventario/inventario.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inventario')
export class InventarioController {
  private readonly logger = new Logger(InventarioController.name);

  constructor(private readonly inventarioService: InventarioService) {}

  // Lectura pública a propósito: el marketplace de invitados carga el stock
  // antes de tener garantizado un token en memoria (mismo patrón que preciosInventario).
  @Get()
  async findAll(): Promise<Inventario[]> {
    return this.inventarioService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() inventario: CreateInventarioDto): Promise<Inventario> {
    return this.inventarioService.create(inventario);
  }

  @UseGuards(JwtAuthGuard)
  @Post('venta')
  async registrarVenta(@Body() body: RegistrarVentaDto) {
    try {
      return await this.inventarioService.descontarStock(body.items);
    } catch (error) {
      // Manejo de errores si falla la venta (ej: no hay stock o inventario)
      throw new HttpException(error.message || 'Error procesando venta', HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ CORRECCIÓN: Eliminé ": Promise<Inventario>" para evitar el error de tipos con null
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() inventario: UpdateInventarioDto) {
    return this.inventarioService.update(id, inventario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/reset/inventario')
  async resetearInventario(): Promise<{ message: string }> {
    try {
      await this.inventarioService.resetearTodo();
      return { message: 'Inventario eliminado correctamente' };
    } catch (error) {
      this.logger.error('Error en resetearInventario():', error);
      throw new HttpException('Error al eliminar inventario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.inventarioService.remove(id);
  }
}