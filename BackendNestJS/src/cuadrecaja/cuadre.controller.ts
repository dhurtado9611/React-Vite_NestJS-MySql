import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { Cuadre } from './cuadre.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cuadre')
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  async findAll(): Promise<Cuadre[]> {
    return this.cuadreService.findAll();
  }

  @Post()
  async create(@Body() cuadre: Cuadre): Promise<Cuadre> {
    return this.cuadreService.create(cuadre);
  }

  // CORREGIDO: Cambiado de @Put a @Patch para coincidir con el frontend
  // y permitir actualización parcial (solo cerrar turno sin borrar lo demás)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() cuadre: Cuadre): Promise<Cuadre> {
    return this.cuadreService.update(id, cuadre);
  }

  // ✅ Esta ruta debe ir antes que ':id' y no debe repetirse
  @Delete('admin/reset/cuadre')
  @UseGuards(JwtAuthGuard)
  async resetearCuadre(): Promise<{ message: string }> {
    console.log('✅ Entrando a resetearCuadre()');

    try {
      await this.cuadreService.resetearTodo();
      return { message: 'Cuadre eliminado correctamente' };
    } catch (error) {
      console.error('❌ Error en resetearCuadre():', error);
      throw new HttpException('Error al eliminar cuadre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.cuadreService.remove(id);
  }
}