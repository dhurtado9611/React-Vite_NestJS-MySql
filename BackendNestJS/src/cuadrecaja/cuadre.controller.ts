import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { Cuadre } from './cuadre.entity';

@Controller('cuadre')
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  findAll(): Promise<Cuadre[]> {
    return this.cuadreService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Cuadre>): Promise<Cuadre> {
    return this.cuadreService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Cuadre>): Promise<Cuadre> {
    return this.cuadreService.update(id, data);
  }
}