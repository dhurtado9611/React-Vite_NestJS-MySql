import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cuadre')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  @Roles('admin', 'invitado')
  findAll() {
    return this.cuadreService.findAll();
  }

  @Post()
  @Roles('admin', 'invitado')
  create(@Body() data: Partial<any>) {
    return this.cuadreService.create(data);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: Partial<any>) {
    return this.cuadreService.update(+id, data);
  }
}