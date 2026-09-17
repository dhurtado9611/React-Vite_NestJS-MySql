import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { Cuadre } from './cuadre.entity';
import { CreateCuadreDto } from './dto/create-cuadre.dto';
import { UpdateCuadreDto } from './dto/update-cuadre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cuadre')
export class CuadreController {
  private readonly logger = new Logger(CuadreController.name);

  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  async findAll(): Promise<Cuadre[]> {
    return this.cuadreService.findAll();
  }

  @Post()
  async create(@Body() cuadre: CreateCuadreDto): Promise<Cuadre> {
    return this.cuadreService.create(cuadre);
  }

  // CORREGIDO: Cambiado de @Put a @Patch para coincidir con el frontend
  // y permitir actualización parcial (solo cerrar turno sin borrar lo demás)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() cuadre: UpdateCuadreDto): Promise<Cuadre> {
    return this.cuadreService.update(id, cuadre);
  }

  // ✅ Esta ruta debe ir antes que ':id' y no debe repetirse
  @Delete('admin/reset/cuadre')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async resetearCuadre(): Promise<{ message: string }> {
    this.logger.log('Entrando a resetearCuadre()');

    try {
      await this.cuadreService.resetearTodo();
      return { message: 'Cuadre eliminado correctamente' };
    } catch (error) {
      this.logger.error('Error en resetearCuadre():', error);
      throw new HttpException('Error al eliminar cuadre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.cuadreService.remove(id);
  }
}