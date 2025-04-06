import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { Cuadre } from './cuadre.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cuadre')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  @Roles('admin', 'invitado')
  findAll(): Promise<Cuadre[]> {
    return this.cuadreService.findAll();
  }

  @Post()
  @Roles('admin', 'invitado')
  create(@Body() data: Partial<Cuadre>): Promise<Cuadre> {
    return this.cuadreService.create(data);
  }

  @Put(':id')
  @Roles('admin', 'invitado')
  update(@Param('id') id: number, @Body() data: Partial<Cuadre>): Promise<Cuadre> {
    return this.cuadreService.update(id, data);
  }
}