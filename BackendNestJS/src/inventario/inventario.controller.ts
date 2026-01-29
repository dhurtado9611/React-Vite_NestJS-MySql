// src/inventario/inventario.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { Inventario } from './inventario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  async findAll(): Promise<Inventario[]> {
    return this.inventarioService.findAll();
  }

  @Post()
  async create(@Body() inventario: Inventario): Promise<Inventario> {
    return this.inventarioService.create(inventario);
  }

  @Post('venta')
  async registrarVenta(@Body() body: { items: { nombre: string; cantidad: number }[] }) {
    try {
      return await this.inventarioService.descontarStock(body.items);
    } catch (error) {
      // Manejo de errores si falla la venta (ej: no hay stock o inventario)
      throw new HttpException(error.message || 'Error procesando venta', HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ CORRECCIÓN: Eliminé ": Promise<Inventario>" para evitar el error de tipos con null
  @Put(':id')
  async update(@Param('id') id: number, @Body() inventario: Inventario) {
    return this.inventarioService.update(id, inventario);
  }

  @Delete('admin/reset/inventario')
  @UseGuards(JwtAuthGuard)
  async resetearInventario(): Promise<{ message: string }> {
    try {
      await this.inventarioService.resetearTodo();
      return { message: 'Inventario eliminado correctamente' };
    } catch (error) {
      console.error('Error en resetearInventario():', error);
      throw new HttpException('Error al eliminar inventario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.inventarioService.remove(id);
  }
}