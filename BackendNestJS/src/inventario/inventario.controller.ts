import { Controller, Delete, Get, Post, Body, Param } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './create-inventario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventario } from './inventario.entity';

@Controller('inventario')
export class InventarioController {
  constructor(
    private readonly service: InventarioService,
    @InjectRepository(Inventario) private readonly inventarioRepo: Repository<Inventario>,
    private readonly dataSource: DataSource
  ) {}

  @Post()
  create(@Body() dto: CreateInventarioDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Delete('reset')
  async resetInventario() {
    await this.inventarioRepo.query('TRUNCATE TABLE inventario');
    return { message: 'Inventario reiniciado correctamente' };
  }
}
