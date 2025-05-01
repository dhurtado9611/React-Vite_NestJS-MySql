// cuadre.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
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

  @Put(':id')
  async update(@Param('id') id: number, @Body() cuadre: Cuadre): Promise<Cuadre> {
    return this.cuadreService.update(id, cuadre);
  }

  @Delete('reset')
  @UseGuards(JwtAuthGuard)
  async resetearCuadre(): Promise<{ message: string }> {
    try {
      await this.cuadreService.resetearTodo();
      return { message: 'Cuadre eliminado correctamente' };
    } catch (error) {
      console.error('Error al resetear cuadre:', error);
      throw new HttpException('Error al eliminar cuadre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.cuadreService.remove(id);
  }
}